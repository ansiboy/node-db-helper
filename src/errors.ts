import { DatabaseConfig } from "./db";

class Errors {
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
}

let errors = new Errors
export default errors