import { TokenIds, TokenId, Token } from "./token";
import { Errors } from "./errors";

// import { Token } from "./token";


export type ExpressionType = "Binary" | "Constant" | "Column" | "Method" | "Table" | "Unary" | "Order";
// export let ExpressionTypes = {
//     Binary: "Binary" as ExpressionType,
//     Constant: "Constant" as ExpressionType,
//     Member: "Member" as ExpressionType,
//     Method: "Method" as ExpressionType,
//     Table: "Table" as ExpressionType,
//     Unary: "Unary" as ExpressionType,
//     Order: "Order" as ExpressionType,
// }

const KeyWords = {
    like: 'like',
    desc: 'desc',
    asc: 'asc',
    is: 'is',
    not: 'not',
}

// interface Token {
//     id: TokenId,
//     text: string,
//     pos: number
// }



abstract class Expression {
    readonly type: ExpressionType;
    constructor(type: ExpressionType) {
        this.type = type;
    }

    abstract toString(): string;
}

export class ConstantExpression<T> extends Expression {
    readonly value: T;
    readonly text: string;

    constructor(value: T) {
        super("Constant");

        if (value === undefined)
            throw Errors.argumentNull('value'); //Errors.create('value is undefined');

        this.value = value;
        this.text = typeof (value) == 'string' ? `'${value}'` : `${value}`;
    }

    toString() {
        return this.text;
    }
}

export class ColumnExpression extends Expression {
    readonly name: string;
    readonly expression: Expression;
    readonly text;

    constructor(name: string, source?: Expression) {
        super("Column");

        this.name = name;
        this.expression = source;
        this.text = `${name}`;
    }

    toString() {
        return this.text;
    }
}

export class BinaryExpression extends Expression {

    readonly operator: string;
    readonly rightExpression: Expression;
    readonly leftExpression: Expression;

    readonly text;

    constructor(op: string, left: Expression, right: Expression) {
        super("Binary")

        this.operator = op;
        this.leftExpression = left;
        this.rightExpression = right;

        this.text = `${left.toString()} ${op} ${right.toString()}`;
    }

    toString() {
        return this.text;
    }
}

export class MethodCallExpression extends Expression {

    private args: Expression[];
    private method: string;
    // private instance: any;

    private text: string;

    constructor(method: string, args: Expression[]) {

        super("Method");

        if (method == null)
            throw Errors.argumentNull('method');

        if (args == null)
            throw Errors.argumentNull('arugments');

        this.method = method;

        this.args = [];
        for (var i = 0; i < args.length; i++) {
            this.args[i] = args[i];
        }

        this.text = `${method}(${args.map(o => o.toString()).join(",")})`
    }

    // eval() {
    //     let func: Function = this.instance[this.method];
    //     return func.apply(this, this.args);
    // }
    toString() {
        return this.text;
    }
}

class UnaryExpression extends Expression {
    private text: string;
    constructor(op: string, expr: Expression) {
        super("Unary");

        if (op == '-')
            this.text = `${op}${expr.toString()}`;
        else
            this.text = `${op} ${expr.toString()}`
    }

    toString() {
        return this.text;
    }
}

type SortType = 'desc' | 'asc';
export class OrderExpression extends Expression {
    private member: ColumnExpression;
    private text: string;
    private _sortType: SortType;

    constructor(member: ColumnExpression, sortType: SortType) {
        super("Order");

        this._sortType = sortType;
        this.member = member;
        this.text = `${member.toString()} ${sortType}`
    }

    get sortType() {
        return this._sortType;
    }

    toString() {
        return this.text;
    }
}

export class Parser {
    // private textPos: number;
    // private ch: string;
    // private textLen: number;
    // private text: string;
    private token: Token;
    // private tokenText: string;

    private functions = {
        iif(arg1, arg2, arg3) {
            if (arg1 == true)
                return arg2;

            return arg3;
        }
    }

    private constants = {
        'null': new ConstantExpression(null),
        'true': new ConstantExpression(true),
        'false': new ConstantExpression(false)
    }

    private constructor(text: string) {
        this.token = new Token(text)
    }

    static parseExpression(text: string): Expression {
        let parser = new Parser(text);
        return parser.parse();
    }

    static parseOrderExpression(text: string): OrderExpression {

        let parser = new Parser(text);

        parser.nextToken();
        let expr = parser.parsePrimary();
        if (expr.type != "Column")
            throw Errors.parseError();

        let tokenText = parser.token.text;
        if (tokenText == 'asc' || tokenText == 'desc') {
            expr = new OrderExpression(expr as ColumnExpression, tokenText);
            parser.nextToken();
        }
        else {
            expr = new OrderExpression(expr as ColumnExpression, 'asc');
        }

        parser.validateToken(TokenIds.End);
        return expr as OrderExpression;
    }

    private nextToken() {
        this.token.next()
    }

    // private setTextPos(pos: number) {
    //     this.textPos = pos;
    //     this.ch = this.textPos < this.textLen ? this.text[this.textPos] : '\0';
    // }
    // private isLetter(s) {
    //     var patrn = /[A-Za-z]/;

    //     if (!patrn.exec(s))
    //         return false;
    //     return true;
    // }
    // private isDigit(s) {
    //     var patrn = /[0-9]/;

    //     if (!patrn.exec(s))
    //         return false;
    //     return true;
    // }
    // private nextChar() {
    //     if (this.textPos < this.textLen)
    //         this.textPos = this.textPos + 1;

    //     this.ch = this.textPos < this.textLen ? this.text[this.textPos] : '\0';
    // }
    // private nextToken() {
    //     while (this.ch == ' ') {
    //         this.nextChar();
    //     }

    //     var t: TokenId = null;
    //     var tokenPos = this.textPos;
    //     let ch = this.ch;
    //     switch (ch) {
    //         case '!':
    //             this.nextChar();
    //             if (this.ch == '=') {
    //                 this.nextChar();
    //                 t = TokenIds.ExclamationEqual;
    //             }
    //             else {
    //                 t = TokenIds.Exclamation;
    //             }
    //             break;
    //         case '%':
    //             this.nextChar;
    //             t = TokenIds.Percent;
    //             break;
    //         case '&':
    //             this.nextChar();
    //             if (this.ch == '&') {
    //                 this.nextChar();
    //                 t = TokenIds.DoubleAmphersand;
    //             }
    //             else {
    //                 t = TokenIds.Amphersand;
    //             }
    //             break;
    //         case '(':
    //             this.nextChar();
    //             t = TokenIds.OpenParen;
    //             break;
    //         case ')':
    //             this.nextChar();
    //             t = TokenIds.CloseParen;
    //             break;
    //         case '*':
    //             this.nextChar();
    //             t = TokenIds.Asterisk;
    //             break;
    //         case '+':
    //             this.nextChar();
    //             t = TokenIds.Plus;
    //             break;
    //         case ',':
    //             this.nextChar();
    //             t = TokenIds.Comma;
    //             break;
    //         case ';':
    //             this.nextChar();
    //             t = TokenIds.Semicolon;
    //             break;
    //         case '-':
    //             this.nextChar();
    //             t = TokenIds.Minus;
    //             break;
    //         case '.':
    //             this.nextChar();
    //             t = TokenIds.Dot;
    //             break;
    //         case '/':
    //             this.nextChar();
    //             t = TokenIds.Slash;
    //             break;
    //         case ':':
    //             this.nextChar();
    //             t = TokenIds.Colon;
    //             break;
    //         case '<':
    //             this.nextChar();
    //             if (this.ch == '=') {
    //                 this.nextChar();
    //                 t = TokenIds.LessThanEqual;
    //             }
    //             else if (this.ch == '>') {
    //                 this.nextChar();
    //                 t = TokenIds.LessGreater;
    //             }
    //             else {
    //                 t = TokenIds.LessThan;
    //             }
    //             break;
    //         case '=':
    //             this.nextChar();
    //             if (this.ch == '=') {
    //                 this.nextChar();
    //                 t = TokenIds.DoubleEqual;
    //             }
    //             else {
    //                 t = TokenIds.Equal;
    //             }
    //             break;
    //         case '>':
    //             this.nextChar();
    //             if (this.ch == '=') {
    //                 this.nextChar();
    //                 t = TokenIds.GreaterThanEqual;
    //             }
    //             else {
    //                 t = TokenIds.GreaterThan;
    //             }
    //             break;
    //         case '?':
    //             this.nextChar();
    //             t = TokenIds.Question;
    //             break;
    //         case '[':
    //             this.nextChar();
    //             t = TokenIds.OpenBracket;
    //             break;
    //         case ']':
    //             this.nextChar();
    //             t = TokenIds.CloseBracket;
    //             break;
    //         case '|':
    //             this.nextChar();
    //             if (ch == '|') {
    //                 this.nextChar();
    //                 t = TokenIds.DoubleBar;
    //             }
    //             else {
    //                 t = TokenIds.Bar;
    //             }
    //             break;
    //         case '"':
    //         case '\'':
    //             var quote = this.ch;
    //             do {
    //                 this.nextChar();
    //                 while (this.textPos < this.textLen && this.ch != quote) this.nextChar();
    //                 if (this.textPos == this.textLen)
    //                     throw Errors.unterminatedStringLiteral(this.textPos);
    //                 //throw ParseError(textPos, Res.UnterminatedStringLiteral);
    //                 this.nextChar();
    //             } while (this.ch == quote);
    //             t = TokenIds.StringLiteral;
    //             break;
    //         default:
    //             if (this.isLetter(this.ch)) {
    //                 do {
    //                     this.nextChar();
    //                 } while (this.isLetter(this.ch) || this.isDigit(this.ch) || this.ch == '_');

    //                 t = TokenIds.Identifier;
    //                 break;
    //             }
    //             if (this.isDigit(this.ch)) {
    //                 t = TokenIds.IntegerLiteral;
    //                 do {
    //                     this.nextChar();
    //                 }
    //                 while (this.isDigit(this.ch));
    //                 if (this.ch == '.') {
    //                     t = TokenIds.RealLiteral;
    //                     this.nextChar();
    //                     this.validateDigit();
    //                     do {
    //                         this.nextChar();
    //                     }
    //                     while (this.isDigit(this.ch));
    //                 }
    //                 break;
    //             }

    //             // if (this.isDigit(this.ch)) {
    //             //     t = TokenIds.IntegerLiteral;
    //             //     do {
    //             //         this.nextChar();
    //             //     } while (this.isDigit(this.ch));
    //             //     break;
    //             // }
    //             // if (this.ch == '.') {
    //             //     t = TokenIds.RealLiteral;
    //             //     this.nextChar();
    //             //     do {
    //             //         this.nextChar();
    //             //     } while (this.isDigit(this.ch));
    //             //     break;
    //             // }

    //             if (this.textPos == this.textLen) {
    //                 t = TokenIds.End;
    //                 break;
    //             }
    //             throw Errors.parseError();
    //     }
    //     this.tokenText = this.text.substr(tokenPos, this.textPos - tokenPos);

    //     let id = t;
    //     let text = this.text.substr(tokenPos, this.textPos - tokenPos);
    //     let pos = tokenPos;
    //     this.token = { id, text, pos };
    // }
    // private validateDigit() {
    //     if (!this.isDigit(this.ch))
    //         throw Errors.parseError();
    // }
    private parsePrimaryStart() {
        switch (this.token.id) {
            case TokenIds.Identifier:
                return this.parseIdentifier();
            case TokenIds.StringLiteral:
                return this.parseStringLiteral();
            case TokenIds.IntegerLiteral:
                return this.parseIntegerLiteral();
            case TokenIds.RealLiteral:
                return this.parseRealLiteral();
            case TokenIds.OpenParen:
                return this.parseParenExpression();
            default:
                throw Errors.unknownToken(this.token.text); //Errors.create(`Unknowed token id "${this.token.id}"`); //ParseError(Res.ExpressionExpected);
        }
    }
    private validateToken(expectedTokenId: TokenId) {
        if (this.token.id != expectedTokenId) {
            throw Errors.unexpectedToken(expectedTokenId, this.token.id);
            // throw Errors.create(`Expect token "${expectedTokenId}", Actual is "${this.token.id}".`);
        }
    }
    private parseIntegerLiteral() {
        var expr = new ConstantExpression(new Number(this.token.text));
        this.nextToken();
        return expr;
    }
    private parseRealLiteral(): Expression {
        this.validateToken(TokenIds.RealLiteral);
        let text = this.token.text;
        let last = text[text.length - 1];
        let value = Number.parseFloat(text);

        let expr = new ConstantExpression(value);
        this.nextToken();
        return expr;
    }
    private parseParenExpression() {
        this.validateToken(TokenIds.OpenParen);
        this.nextToken();
        var expr = this.parseExpression();
        this.validateToken(TokenIds.CloseParen);
        this.nextToken();
        return expr;
    }
    private parseStringLiteral() {
        var text = this.token.text;
        var expr = new ConstantExpression(text.substr(1, text.length - 2));
        this.nextToken();
        return expr;
    }
    private parseFunction(): Expression {
        let func = this.functions[this.token.text];
        console.assert(func != null);
        this.nextToken();

        this.validateToken(TokenIds.OpenParen);
        this.nextToken();

        let args = [];
        while (true) {
            let expr = this.parseExpression();
            args[args.length] = expr;
            if (this.token.id == TokenIds.CloseParen)
                break;

            this.validateToken(TokenIds.Comma);
            this.nextToken();
        }

        this.validateToken(TokenIds.CloseParen);
        this.nextToken();

        let expr = new MethodCallExpression(func, args);
        return expr;
    }
    private parseIdentifier(): Expression {
        var self = this;
        var constant = this.constants[this.token.text.toLowerCase()];
        if (constant != null) {
            this.nextToken();
            return constant;
        }
        var func = this.functions[this.token.text];
        if (func != null) {
            return this.parseFunction();
        };

        let name = this.token.text;
        this.nextToken();
        while (this.token.id == TokenIds.Dot) {
            this.nextToken();
            name = name + '.' + this.token.text;
            this.nextToken();
        }

        let expr = new ColumnExpression(name);
        return expr;

        // throw Errors.create(`Parse expression "${this.tokenText}" fail."`);
    }
    private parsePrimary() {
        switch (this.token.id) {
            case TokenIds.Identifier:
                return this.parseIdentifier();
            case TokenIds.StringLiteral:
                return this.parseStringLiteral();
            case TokenIds.IntegerLiteral:
                return this.parseIntegerLiteral();
            case TokenIds.RealLiteral:
                return this.parseRealLiteral();
            case TokenIds.OpenParen:
                return this.parseParenExpression();
            default:
                throw Errors.unknownToken(this.token.text); //Errors.create(`Unknowed token id "${this.token.id}"`); //ParseError(Res.ExpressionExpected);
        }
    }
    // -, !, not unary operators
    private parseUnary() {
        let tokenId = this.token.id;
        if (this.token.text == '-' || this.token.text == KeyWords.not) {
            var op = this.token.text;
            this.nextToken();

            // if (op.id == TokenIds.Minus && (this.token.id == TokenIds.IntegerLiteral || this.token.id == TokenIds.RealLiteral)) {
            //     this.token.text = '-' + this.token.text;
            //     this.token.pos = op.pos;
            //     return this.parsePrimary();
            // }
            var expr = this.parseUnary();
            // if (op.id == TokenIds.Minus) {
            //     expr = new UnaryExpression('-', expr);
            //     return expr
            // }
            // else if (this.token.text == KeyWords.not) {
            //     expr = new UnaryExpression(this.token.text, expr)
            //     return expr
            // }
            expr = new UnaryExpression(op, expr)
            return expr;
        }
        return this.parsePrimary();
    }
    private parseMultiplicative(): Expression {
        var left = this.parseUnary();
        while (this.token.id == TokenIds.Asterisk || this.token.id == TokenIds.Slash ||
            this.token.id == TokenIds.Percent) {
            var op = this.token.text;
            this.nextToken();
            var right = this.parseUnary();

            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    private parseLogicalOr(): Expression {
        var left = this.parseLogicalAnd();
        if (this.token.text == '||' || this.token.text == 'or') {
            var op = this.token.text;
            this.nextToken();

            var right = this.parseLogicalOr();
            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    private parseLogicalAnd(): Expression {
        var left = this.parseComparison();
        if (this.token.text == '&&' || this.token.text == 'and') {
            var op = this.token.text;
            this.nextToken();
            var right = this.parseLogicalAnd();
            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    // =, ==, !=, <>, >, >=, <, <= operators
    private parseComparison(): Expression {
        var left = this.parseAdditive();
        while (this.token.id == TokenIds.Equal || this.token.id == TokenIds.DoubleEqual ||
            this.token.id == TokenIds.ExclamationEqual || this.token.id == TokenIds.LessGreater ||
            this.token.id == TokenIds.GreaterThan || this.token.id == TokenIds.GreaterThanEqual ||
            this.token.id == TokenIds.LessThan || this.token.id == TokenIds.LessThanEqual ||
            this.token.text == KeyWords.like || this.token.text == KeyWords.is) {

            var op = this.token.text;
            this.nextToken();
            var right = this.parseAdditive();
            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }

    // +, -, & operators
    private parseAdditive(): Expression {
        var left = this.parseMultiplicative();
        while (this.token.id == TokenIds.Plus || this.token.id == TokenIds.Minus || this.token.id == TokenIds.Amphersand) {
            var tokenId = this.token.id;
            var tokenText = this.token.text;

            this.nextToken();
            var right = this.parseMultiplicative();
            var expr = new BinaryExpression(tokenText, left, right);
            left = expr;
        }
        return left;
    }
    private parseExpression(): Expression {
        var expr = this.parseLogicalOr();
        return expr;
    }


    parse(): Expression {
        this.nextToken();
        var expr = this.parseExpression();
        this.validateToken(TokenIds.End);
        return expr;
    }

}

