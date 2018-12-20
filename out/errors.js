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
}
let errors = new Errors;
exports.default = errors;
//# sourceMappingURL=errors.js.map