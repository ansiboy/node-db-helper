export declare type ExpressionType = "Binary" | "Constant" | "Column" | "Method" | "Table" | "Unary" | "Order";
declare abstract class Expression {
    readonly type: ExpressionType;
    constructor(type: ExpressionType);
    abstract toString(): string;
}
export declare class ConstantExpression<T> extends Expression {
    readonly value: T;
    readonly text: string;
    constructor(value: T);
    toString(): string;
}
export declare class ColumnExpression extends Expression {
    readonly name: string;
    readonly expression: Expression;
    readonly text: any;
    constructor(name: string, source?: Expression);
    toString(): any;
}
export declare class BinaryExpression extends Expression {
    readonly operator: string;
    readonly rightExpression: Expression;
    readonly leftExpression: Expression;
    readonly text: any;
    constructor(op: string, left: Expression, right: Expression);
    toString(): any;
}
export declare class MethodCallExpression extends Expression {
    private args;
    private method;
    private text;
    constructor(method: string, args: Expression[]);
    toString(): string;
}
declare type SortType = 'desc' | 'asc';
export declare class OrderExpression extends Expression {
    private member;
    private text;
    private _sortType;
    constructor(member: ColumnExpression, sortType: SortType);
    readonly sortType: SortType;
    toString(): string;
}
export declare class Parser {
    private token;
    private functions;
    private constants;
    private constructor();
    static parseExpression(text: string): Expression;
    static parseOrderExpression(text: string): OrderExpression;
    private nextToken;
    private parsePrimaryStart;
    private validateToken;
    private parseIntegerLiteral;
    private parseRealLiteral;
    private parseParenExpression;
    private parseStringLiteral;
    private parseFunction;
    private parseIdentifier;
    private parsePrimary;
    private parseUnary;
    private parseMultiplicative;
    private parseLogicalOr;
    private parseLogicalAnd;
    private parseComparison;
    private parseAdditive;
    private parseExpression;
    parse(): Expression;
}
export {};
