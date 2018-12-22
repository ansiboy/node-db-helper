import { DatabaseConfig } from "./db";

export class Errors {
    ConfigMissField(field: string): any {
        throw new Error(`Config miss item named ${field}."`);
    }
    DbConfigMissField(field: keyof DatabaseConfig): any {
        throw new Error(`Database config miss item named ${field}."`);
    }
    configFileNotExists(config_path: string): any {
        let error = new Error(`Config file ${config_path} is not exists.`)
        return error
    }
    arugmentNull(name: string): any {
        let error = new Error(`Argument ${name} cannt null or empty.`);
        return error
    }
    parseSortFail(sort: string): any {
        let error = new Error(`Parser sort fail, filter is '${sort}'`);
        return error
    }
    parseFilterFail(filter: string): Error {
        let error = new Error(`Parser filter fail, filter is '${filter}'`);
        return error
    }
    billDetailNotExists(productId: string) {
        let error = new Error(`Bill detail with product id ${productId} is not exists.`)
        return error
    }

    static argumentNull(name: string): any {
        return this.create(Errors.argumentNull.name, `Argument ${name} can not be null or empty.`);
    }
    static create(name: string, msg: string) {
        let err = new Error(msg);
        err.name = name;
        return err;
    }
    static unterminatedStringLiteral(literal: number) {
        return Errors.create(Errors.unterminatedStringLiteral.name, `unterminated string literal at ${literal}`);
    };
    static parseError() {
        return Errors.create(Errors.parseError.name, 'parse error');
    };
    static notImplemented() {
        return Errors.create(Errors.notImplemented.name, 'notImplemented');
    }
    static unknownToken(token: string) {
        let msg = `Unknowed token id "${token}"`;
        return Errors.create(Errors.unknownToken.name, msg)
    }
    static unexpectedToken(expected: string, actual: string): any {
        let msg = `Expect token "${expected}", Actual is "${actual}".`;
        return Errors.create(Errors.unexpectedToken.name, msg);
    }
}

let errors = new Errors
export default errors