import * as mysql from 'mysql'
import { Parser } from './expression';
import errors from './errors';
import * as path from 'path';
import * as fs from 'fs'
import { parse } from 'json5'

let config = loadConfig()

var pool = mysql.createPool({
    host: config.host, //'localhost',
    user: config.user, //'liuyunyuan',
    password: config.password, //'Xuan520Lv',
    database: config.database, //'shop_stock'
});

export interface Entity {
    id: string,
    create_date_time: Date,
    application_id: string,
}

export interface SelectArguments {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;
}

export interface SelectResult<T> {
    dataItems: T[],
    totalRowCount: number,
}


export interface DatabaseConfig {
    host: string,
    user: string,
    password: string,
    database: string,
}

export class Connection {
    applicationId?: string;
    source: mysql.PoolConnection;
    constructor(applicationId: string, source: mysql.PoolConnection) {
        this.applicationId = applicationId
        this.source = source
    }
    end() {
        this.source.release()
    }
}

export function getConnection(applicationId?: string): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
        pool.getConnection((err, source) => {
            if (err) {
                console.log(err)
                console.error('get pool connection fail')
                reject(err)
                return
            }

            console.assert(source != null, 'get pool connection fail')
            let conn = new Connection(applicationId, source)
            resolve(conn)
        })
    })
}

function query<T>(conn: Connection, options: any, values?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        conn.source.query(options, values, (error, result, fields) => {
            if (error) {
                reject(error)
                return
            }

            resolve(result)
        })
    })
}

export async function insert<T extends Entity>(conn: Connection, tableName: string, item: T): Promise<Partial<Entity>> {
    if (!tableName) throw errors.arugmentNull('tableName')
    if (!item) throw errors.arugmentNull('item')

    if (!item.id)
        item.id = guid()

    item.create_date_time = new Date(Date.now())
    if (conn.applicationId)
        item.application_id = conn.applicationId

    let names = Object.getOwnPropertyNames(item)
    for (let i = 0; i < names.length; i++) {
        let name = names[i]
        let value = item[name]
        if (typeof value == "object" && !(value instanceof Date)) {
            item[name] = JSON.stringify(value)
        }
    }

    let sql = `insert into ${tableName} set ?`;
    return query<T>(conn, sql, item).then(() => {
        return {
            id: item.id,
            create_date_teim: item.create_date_time
        }
    })
}

export async function update<T extends Entity>(conn: Connection, tableName: string, item: Partial<T>) {
    if (!tableName) throw errors.arugmentNull('tableName')
    if (!item) throw errors.arugmentNull('item')
    if (!item.id) throw errors.arugmentNull('item.id')

    let names = Object.getOwnPropertyNames(item)
    if (names.length == 0) {
        return Promise.resolve()
    }

    let values = []
    let sql = `update ${tableName} set`;
    for (let i = 0; i < names.length; i++) {
        sql = sql + ` ${names[i]} = ?`
        if (i < names.length - 1) {
            sql = sql + ','
        }
        values.push(item[names[i]])
    }

    sql = sql + ` where id = '${item.id}'`
    if (conn.applicationId) {
        sql = sql + ` application_id = '${conn.applicationId}'`
    }

    return query<T>(conn, sql, values)
}

export async function list<T>(conn: Connection, tableName: string, args?: SelectArguments): Promise<SelectResult<T>> {
    args = Object.assign({
        startRowIndex: 0, maximumRows: 100
    } as SelectArguments, args || {})

    if (args.filter) {
        let expr = Parser.parseExpression(args.filter);
        if (expr.type != "Binary") {
            throw errors.parseFilterFail(args.filter)
        }
    }
    if (args.sortExpression) {
        let expr = Parser.parseOrderExpression(args.sortExpression);
        if (expr.type != "Order") {
            throw errors.parseSortFail(args.sortExpression)
        }
    }
    else {
        args.sortExpression = 'create_date_time desc'
    }

    if (conn.applicationId) {
        args.filter = args.filter ?
            `${args.filter} and application_id = '${conn.applicationId}'` :
            `application_id = '${conn.applicationId}'`
    }

    let sql_filter = args.filter ? 'where ' + args.filter : ''
    let p1 = new Promise<T[]>((resolve, reject) => {
        let sql = `select * from ${tableName} ${sql_filter}
                   order by ${args.sortExpression}
                   limit ${args.maximumRows} offset ${args.startRowIndex}`;

        conn.source.query(sql, args, (err, rows: Array<any>, fields) => {
            if (err) {
                reject(err);
                return;
            }

            fields.forEach(field => {
                if (field.type != mysql.Types.JSON)
                    return

                rows.forEach(item => {
                    let value = item[field.name]
                    if (value != null)
                        item[field.name] = JSON.parse(value)
                })
            })

            resolve(rows);
        });
    })

    let p2 = new Promise<number>((resolve, reject) => {
        let sql = `select count(*) as count from ${tableName} ${sql_filter} order by create_date_time desc`;
        conn.source.query(sql, args, (err, rows, fields) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(rows[0].count);
        });
    })

    let r = await Promise.all([p1, p2]);
    let dataItems = r[0];
    let totalRowCount = r[1];

    return { dataItems, totalRowCount }

}

export async function get<T>(conn: Connection, tableName, filter: Partial<T>): Promise<T> {
    if (!tableName) throw errors.arugmentNull('tableName')
    if (!filter) throw errors.arugmentNull('id')
    let text_filter = ''
    let names = Object.getOwnPropertyNames(filter)
    let values = []
    for (let i = 0; i < names.length; i++) {
        if (i == 0)
            text_filter = `${names[i]} = ?`
        else
            text_filter = `${text_filter} and ${names[i]} = ?`

        values.push(filter[names[i]])
    }
    let sql = `select * from ${tableName} where ${text_filter} limit 1`;
    return new Promise<T>((resolve, reject) => {
        conn.source.query(sql, values, (err, rows: Array<any>, fields) => {
            if (err) {
                reject(err)
                return
            }

            fields.forEach(field => {
                if (field.type != mysql.Types.JSON)
                    return

                rows.forEach(item => {
                    let value = item[field.name]
                    if (value != null)
                        item[field.name] = JSON.parse(value)
                })
            })

            resolve(rows[0]);
        });
    })
}

export async function remove(conn: Connection, tableName: string, id: string) {
    if (!tableName) throw errors.arugmentNull('tableName')
    if (!id) throw errors.arugmentNull('id')
    let sql = `delete from ${tableName} where id = ?`
    return query(conn, sql, [id])
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function loadConfig() {
    let config_path = path.join(__dirname, '../../../config.json5')
    if (!fs.existsSync(config_path))
        throw errors.configFileNotExists(config_path);

    let configText = fs.readFileSync(config_path).toString()


    let config1 = parse(configText)


    let config: DatabaseConfig = config1["maishu-mysql-helper"]
    if (!config)
        throw errors.ConfigMissField("maishu-mysql-helper");

    if (!config.host)
        throw errors.DbConfigMissField('host')

    if (!config.database)
        throw errors.configFileNotExists('database')

    if (!config.password)
        throw errors.configFileNotExists('password')

    if (!config.user)
        throw errors.configFileNotExists('user')

    return config
}
