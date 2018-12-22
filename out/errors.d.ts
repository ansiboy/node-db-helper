import { DatabaseConfig } from "./db";
export declare class Errors {
    ConfigMissField(field: string): any;
    DbConfigMissField(field: keyof DatabaseConfig): any;
    configFileNotExists(config_path: string): any;
    arugmentNull(name: string): any;
    parseSortFail(sort: string): any;
    parseFilterFail(filter: string): Error;
    billDetailNotExists(productId: string): Error;
    static argumentNull(name: string): any;
    static create(name: string, msg: string): Error;
    static unterminatedStringLiteral(literal: number): Error;
    static parseError(): Error;
    static notImplemented(): Error;
    static unknownToken(token: string): Error;
    static unexpectedToken(expected: string, actual: string): any;
}
declare let errors: Errors;
export default errors;
