"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errors {
    ConfigMissField(field) {
        throw new Error(`Config miss item named ${field}."`);
    }
    DbConfigMissField(field) {
        throw new Error(`Database config miss item named ${field}."`);
    }
    configFileNotExists(config_path) {
        let error = new Error(`Config file ${config_path} is not exists.`);
        return error;
    }
    arugmentNull(name) {
        let error = new Error(`Argument ${name} cannt null or empty.`);
        return error;
    }
    parseSortFail(sort) {
        let error = new Error(`Parser sort fail, filter is '${sort}'`);
        return error;
    }
    parseFilterFail(filter) {
        let error = new Error(`Parser filter fail, filter is '${filter}'`);
        return error;
    }
    billDetailNotExists(productId) {
        let error = new Error(`Bill detail with product id ${productId} is not exists.`);
        return error;
    }
    static argumentNull(name) {
        return this.create(Errors.argumentNull.name, `Argument ${name} can not be null or empty.`);
    }
    static create(name, msg) {
        let err = new Error(msg);
        err.name = name;
        return err;
    }
    static unterminatedStringLiteral(literal) {
        return Errors.create(Errors.unterminatedStringLiteral.name, `unterminated string literal at ${literal}`);
    }
    ;
    static parseError() {
        return Errors.create(Errors.parseError.name, 'parse error');
    }
    ;
    static notImplemented() {
        return Errors.create(Errors.notImplemented.name, 'notImplemented');
    }
    static unknownToken(token) {
        let msg = `Unknowed token id "${token}"`;
        return Errors.create(Errors.unknownToken.name, msg);
    }
    static unexpectedToken(expected, actual) {
        let msg = `Expect token "${expected}", Actual is "${actual}".`;
        return Errors.create(Errors.unexpectedToken.name, msg);
    }
}
exports.Errors = Errors;
let errors = new Errors;
exports.default = errors;
//# sourceMappingURL=errors.js.map