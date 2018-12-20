"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const expression_1 = require("./expression");
const errors_1 = require("./errors");
const path = require("path");
const fs = require("fs");
const json5_1 = require("json5");
let config = loadConfig();
var pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
});
class Connection {
    constructor(applicationId, source) {
        this.applicationId = applicationId;
        this.source = source;
    }
    end() {
        this.source.release();
    }
}
exports.Connection = Connection;
function getConnection(applicationId) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, source) => {
            if (err) {
                console.log(err);
                console.error('get pool connection fail');
                reject(err);
                return;
            }
            console.assert(source != null, 'get pool connection fail');
            let conn = new Connection(applicationId, source);
            resolve(conn);
        });
    });
}
exports.getConnection = getConnection;
function query(conn, options, values) {
    return new Promise((resolve, reject) => {
        conn.source.query(options, values, (error, result, fields) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}
function insert(conn, tableName, item) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tableName)
            throw errors_1.default.arugmentNull('tableName');
        if (!item)
            throw errors_1.default.arugmentNull('item');
        if (!item.id)
            item.id = guid();
        item.create_date_time = new Date(Date.now());
        if (conn.applicationId)
            item.application_id = conn.applicationId;
        let names = Object.getOwnPropertyNames(item);
        for (let i = 0; i < names.length; i++) {
            let name = names[i];
            let value = item[name];
            if (typeof value == "object" && !(value instanceof Date)) {
                item[name] = JSON.stringify(value);
            }
        }
        let sql = `insert into ${tableName} set ?`;
        return query(conn, sql, item).then(() => {
            return {
                id: item.id,
                create_date_teim: item.create_date_time
            };
        });
    });
}
exports.insert = insert;
function update(conn, tableName, item) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tableName)
            throw errors_1.default.arugmentNull('tableName');
        if (!item)
            throw errors_1.default.arugmentNull('item');
        if (!item.id)
            throw errors_1.default.arugmentNull('item.id');
        let names = Object.getOwnPropertyNames(item);
        if (names.length == 0) {
            return Promise.resolve();
        }
        let values = [];
        let sql = `update ${tableName} set`;
        for (let i = 0; i < names.length; i++) {
            sql = sql + ` ${names[i]} = ?`;
            if (i < names.length - 1) {
                sql = sql + ',';
            }
            values.push(item[names[i]]);
        }
        sql = sql + ` where id = '${item.id}'`;
        if (conn.applicationId) {
            sql = sql + ` application_id = '${conn.applicationId}'`;
        }
        return query(conn, sql, values);
    });
}
exports.update = update;
function list(conn, tableName, args) {
    return __awaiter(this, void 0, void 0, function* () {
        args = Object.assign({
            startRowIndex: 0, maximumRows: 100
        }, args || {});
        if (args.filter) {
            let expr = expression_1.Parser.parseExpression(args.filter);
            if (expr.type != expression_1.ExpressionTypes.Binary) {
                throw errors_1.default.parseFilterFail(args.filter);
            }
        }
        if (args.sortExpression) {
            let expr = expression_1.Parser.parseOrderExpression(args.sortExpression);
            if (expr.type != expression_1.ExpressionTypes.Order) {
                throw errors_1.default.parseSortFail(args.sortExpression);
            }
        }
        else {
            args.sortExpression = 'create_date_time desc';
        }
        if (conn.applicationId) {
            args.filter = args.filter ?
                `${args.filter} and application_id = '${conn.applicationId}'` :
                `application_id = '${conn.applicationId}'`;
        }
        let sql_filter = args.filter ? 'where ' + args.filter : '';
        let p1 = new Promise((resolve, reject) => {
            let sql = `select * from ${tableName} ${sql_filter}
                   order by ${args.sortExpression}
                   limit ${args.maximumRows} offset ${args.startRowIndex}`;
            conn.source.query(sql, args, (err, rows, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                fields.forEach(field => {
                    if (field.type != mysql.Types.JSON)
                        return;
                    rows.forEach(item => {
                        let value = item[field.name];
                        if (value != null)
                            item[field.name] = JSON.parse(value);
                    });
                });
                resolve(rows);
            });
        });
        let p2 = new Promise((resolve, reject) => {
            let sql = `select count(*) as count from ${tableName} ${sql_filter} order by create_date_time desc`;
            conn.source.query(sql, args, (err, rows, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0].count);
            });
        });
        let r = yield Promise.all([p1, p2]);
        let dataItems = r[0];
        let totalRowCount = r[1];
        return { dataItems, totalRowCount };
    });
}
exports.list = list;
function get(conn, tableName, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tableName)
            throw errors_1.default.arugmentNull('tableName');
        if (!filter)
            throw errors_1.default.arugmentNull('id');
        let text_filter = '';
        let names = Object.getOwnPropertyNames(filter);
        let values = [];
        for (let i = 0; i < names.length; i++) {
            if (i == 0)
                text_filter = `${names[i]} = ?`;
            else
                text_filter = `${text_filter} and ${names[i]} = ?`;
            values.push(filter[names[i]]);
        }
        let sql = `select * from ${tableName} where ${text_filter} limit 1`;
        return new Promise((resolve, reject) => {
            conn.source.query(sql, values, (err, rows, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                fields.forEach(field => {
                    if (field.type != mysql.Types.JSON)
                        return;
                    rows.forEach(item => {
                        let value = item[field.name];
                        if (value != null)
                            item[field.name] = JSON.parse(value);
                    });
                });
                resolve(rows[0]);
            });
        });
    });
}
exports.get = get;
function remove(conn, tableName, id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tableName)
            throw errors_1.default.arugmentNull('tableName');
        if (!id)
            throw errors_1.default.arugmentNull('id');
        let sql = `delete from ${tableName} where id = ?`;
        return query(conn, sql, [id]);
    });
}
exports.remove = remove;
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
    let config_path = path.join(__dirname, '../../../config.json5');
    if (!fs.existsSync(config_path))
        throw errors_1.default.configFileNotExists(config_path);
    let configText = fs.readFileSync(config_path).toString();
    let config1 = json5_1.parse(configText);
    let config = config1["maishu-mysql-helper"];
    if (!config)
        throw errors_1.default.ConfigMissField("maishu-mysql-helper");
    if (!config.host)
        throw errors_1.default.DbConfigMissField('host');
    if (!config.database)
        throw errors_1.default.configFileNotExists('database');
    if (!config.password)
        throw errors_1.default.configFileNotExists('password');
    if (!config.user)
        throw errors_1.default.configFileNotExists('user');
    return config;
}
//# sourceMappingURL=db.js.map