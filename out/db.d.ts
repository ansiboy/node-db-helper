import * as mysql from 'mysql';
export interface Entity {
    id: string;
    create_date_time: Date;
    application_id: string;
}
export interface SelectArguments {
    startRowIndex?: number;
    maximumRows?: number;
    sortExpression?: string;
    filter?: string;
}
export interface SelectResult<T> {
    dataItems: T[];
    totalRowCount: number;
}
export interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}
export declare class Connection {
    applicationId?: string;
    source: mysql.PoolConnection;
    constructor(applicationId: string, source: mysql.PoolConnection);
    end(): void;
}
export declare function getConnection(applicationId?: string): Promise<Connection>;
export declare function insert<T extends Entity>(conn: Connection, tableName: string, item: T): Promise<Partial<Entity>>;
export declare function update<T extends Entity>(conn: Connection, tableName: string, item: Partial<T>): Promise<void | T>;
export declare function list<T>(conn: Connection, tableName: string, args?: SelectArguments): Promise<SelectResult<T>>;
export declare function get<T>(conn: Connection, tableName: any, filter: Partial<T>): Promise<T>;
export declare function remove(conn: Connection, tableName: string, id: string): Promise<{}>;
