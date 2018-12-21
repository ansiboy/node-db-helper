"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let TokenIds = {
    Amphersand: "Amphersand",
    Asterisk: "Asterisk",
    Bar: "Bar",
    CloseParen: "CloseParen",
    CloseBracket: "CloseBracket",
    Colon: "Colon",
    Comma: "Comma",
    Dot: "Dot",
    DoubleBar: "DoubleBar",
    DoubleAmphersand: "DoubleAmphersand",
    DoubleEqual: "DoubleEqual",
    End: "End",
    Equal: "Equal",
    Exclamation: "Exclamation",
    ExclamationEqual: "ExclamationEqual",
    GreaterThan: "GreaterThan",
    GreaterThanEqual: "GreaterThanEqual",
    Identifier: "Identifier",
    IntegerLiteral: "IntegerLiteral",
    LessGreater: "LessGreater",
    LessThan: "LessThan",
    LessThanEqual: "LessThanEqual",
    /** 符号：- */
    Minus: "Minus",
    RealLiteral: "RealLiteral",
    OpenBracket: "OpenBracket",
    OpenParen: "OpenParen",
    Percent: "Percent",
    Plus: "Plus",
    Question: "Question",
    Semicolon: "Semicolon",
    StringLiteral: "StringLiteral",
    Slash: "Slash"
};
var ExpressionTypes;
(function (ExpressionTypes) {
    ExpressionTypes[ExpressionTypes["Binary"] = 0] = "Binary";
    ExpressionTypes[ExpressionTypes["Constant"] = 1] = "Constant";
    ExpressionTypes[ExpressionTypes["Member"] = 2] = "Member";
    ExpressionTypes[ExpressionTypes["Method"] = 3] = "Method";
    ExpressionTypes[ExpressionTypes["Table"] = 4] = "Table";
    ExpressionTypes[ExpressionTypes["Unary"] = 5] = "Unary";
    ExpressionTypes[ExpressionTypes["Order"] = 6] = "Order";
})(ExpressionTypes = exports.ExpressionTypes || (exports.ExpressionTypes = {}));
const KeyWords = {
    like: 'like',
    desc: 'desc',
    asc: 'asc',
    is: 'is',
    not: 'not',
};
class Errors {
    static argumentNull(name) {
        return this.create(this.names.ArgumentNull, `Argument ${name} can not be null or empty.`);
    }
    static create(name, msg) {
        let err = new Error(msg);
        err.name = name;
        return err;
    }
    static unterminatedStringLiteral(literal) {
        return Errors.create(this.names.UnterminatedStringLiteral, `unterminated string literal at ${literal}`);
    }
    ;
    static parseError() {
        return Errors.create(this.names.ParseError, 'parse error');
    }
    ;
    static notImplemented() {
        return Errors.create(this.names.NotImplemented, 'notImplemented');
    }
    static unknownToken(token) {
        let msg = `Unknowed token id "${token.text}"`;
    }
    static unexpectedToken(expected, actual) {
        let msg = `Expect token "${expected}", Actual is "${actual}".`;
        return Errors.create(this.names.UnexpectedToken, msg);
    }
}
Errors.names = {
    UnterminatedStringLiteral: 'UnterminatedStringLiteral',
    ArgumentNull: 'ArgumentNull',
    ParseError: 'ParseError',
    NotImplemented: 'NotImplemented',
    UnknownToken: 'UnknownToken',
    UnexpectedToken: 'UnexpectedToken'
};
class Expression {
    constructor(type) {
        this._type = type;
    }
    get type() {
        return this._type;
    }
}
class ConstantExpression extends Expression {
    constructor(value) {
        super(ExpressionTypes.Constant);
        if (value === undefined)
            throw Errors.argumentNull('value'); //Errors.create('value is undefined');
        this.value = value;
        this.text = typeof (value) == 'string' ? `'${value}'` : `${value}`;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    toString() {
        return this.text;
    }
}
exports.ConstantExpression = ConstantExpression;
class MemberExpression extends Expression {
    constructor(name, source) {
        super(ExpressionTypes.Member);
        this._name = name;
        this._expression = source;
        this.text = `${name}`;
    }
    get expression() {
        return this._expression;
    }
    get name() {
        return this._name;
    }
    toString() {
        return this.text;
    }
}
exports.MemberExpression = MemberExpression;
class BinaryExpression extends Expression {
    constructor(op, left, right) {
        super(ExpressionTypes.Binary);
        this._operator = op;
        this._leftExpression = left;
        this._rightExpression = right;
        this.text = `${left.toString()} ${op} ${right.toString()}`;
    }
    get leftExpression() {
        return this._leftExpression;
    }
    get rightExpression() {
        return this._rightExpression;
    }
    get operator() {
        return this._operator;
    }
    toString() {
        return this.text;
    }
}
exports.BinaryExpression = BinaryExpression;
// export class TableExpression extends Expression {
//     constructor(name: string) {
//         super(ExpressionTypes.Table);
//     }
// }
class MethodCallExpression extends Expression {
    constructor(method, args) {
        super(ExpressionTypes.Method);
        if (method == null)
            throw Errors.argumentNull('method');
        if (args == null)
            throw Errors.argumentNull('arugments');
        this.method = method;
        this.args = [];
        for (var i = 0; i < args.length; i++) {
            this.args[i] = args[i];
        }
        this.text = `${method}(${args.map(o => o.toString()).join(",")})`;
    }
    // eval() {
    //     let func: Function = this.instance[this.method];
    //     return func.apply(this, this.args);
    // }
    toString() {
        return this.text;
    }
}
exports.MethodCallExpression = MethodCallExpression;
class UnaryExpression extends Expression {
    constructor(op, expr) {
        super(ExpressionTypes.Unary);
        if (op == '-')
            this.text = `${op}${expr.toString()}`;
        else
            this.text = `${op} ${expr.toString()}`;
    }
    toString() {
        return this.text;
    }
}
class OrderExpression extends Expression {
    constructor(member, sortType) {
        super(ExpressionTypes.Order);
        this._sortType = sortType;
        this.member = member;
        this.text = `${member.toString()} ${sortType}`;
    }
    get sortType() {
        return this._sortType;
    }
    toString() {
        return this.text;
    }
}
exports.OrderExpression = OrderExpression;
class Parser {
    constructor(text) {
        this.functions = {
            iif(arg1, arg2, arg3) {
                if (arg1 == true)
                    return arg2;
                return arg3;
            }
        };
        this.constants = {
            'null': new ConstantExpression(null),
            'true': new ConstantExpression(true),
            'false': new ConstantExpression(false)
        };
        this.text = text;
        this.textLen = text.length;
        this.setTextPos(0);
    }
    static parseExpression(text) {
        let parser = new Parser(text);
        return parser.parse();
    }
    static parseOrderExpression(text) {
        let parser = new Parser(text);
        parser.nextToken();
        let expr = parser.parsePrimary();
        if (expr.type != ExpressionTypes.Member)
            throw Errors.parseError();
        let tokenText = parser.token.text;
        if (tokenText == 'asc' || tokenText == 'desc') {
            expr = new OrderExpression(expr, tokenText);
            parser.nextToken();
        }
        else {
            expr = new OrderExpression(expr, 'asc');
        }
        parser.validateToken(TokenIds.End);
        return expr;
    }
    setTextPos(pos) {
        this.textPos = pos;
        this.ch = this.textPos < this.textLen ? this.text[this.textPos] : '\0';
    }
    isLetter(s) {
        var patrn = /[A-Za-z]/;
        if (!patrn.exec(s))
            return false;
        return true;
    }
    isDigit(s) {
        var patrn = /[0-9]/;
        if (!patrn.exec(s))
            return false;
        return true;
    }
    nextChar() {
        if (this.textPos < this.textLen)
            this.textPos = this.textPos + 1;
        this.ch = this.textPos < this.textLen ? this.text[this.textPos] : '\0';
    }
    nextToken() {
        while (this.ch == ' ') {
            this.nextChar();
        }
        var t = null;
        var tokenPos = this.textPos;
        let ch = this.ch;
        switch (ch) {
            case '!':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = TokenIds.ExclamationEqual;
                }
                else {
                    t = TokenIds.Exclamation;
                }
                break;
            case '%':
                this.nextChar;
                t = TokenIds.Percent;
                break;
            case '&':
                this.nextChar();
                if (this.ch == '&') {
                    this.nextChar();
                    t = TokenIds.DoubleAmphersand;
                }
                else {
                    t = TokenIds.Amphersand;
                }
                break;
            case '(':
                this.nextChar();
                t = TokenIds.OpenParen;
                break;
            case ')':
                this.nextChar();
                t = TokenIds.CloseParen;
                break;
            case '*':
                this.nextChar();
                t = TokenIds.Asterisk;
                break;
            case '+':
                this.nextChar();
                t = TokenIds.Plus;
                break;
            case ',':
                this.nextChar();
                t = TokenIds.Comma;
                break;
            case ';':
                this.nextChar();
                t = TokenIds.Semicolon;
                break;
            case '-':
                this.nextChar();
                t = TokenIds.Minus;
                break;
            case '.':
                this.nextChar();
                t = TokenIds.Dot;
                break;
            case '/':
                this.nextChar();
                t = TokenIds.Slash;
                break;
            case ':':
                this.nextChar();
                t = TokenIds.Colon;
                break;
            case '<':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = TokenIds.LessThanEqual;
                }
                else if (this.ch == '>') {
                    this.nextChar();
                    t = TokenIds.LessGreater;
                }
                else {
                    t = TokenIds.LessThan;
                }
                break;
            case '=':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = TokenIds.DoubleEqual;
                }
                else {
                    t = TokenIds.Equal;
                }
                break;
            case '>':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = TokenIds.GreaterThanEqual;
                }
                else {
                    t = TokenIds.GreaterThan;
                }
                break;
            case '?':
                this.nextChar();
                t = TokenIds.Question;
                break;
            case '[':
                this.nextChar();
                t = TokenIds.OpenBracket;
                break;
            case ']':
                this.nextChar();
                t = TokenIds.CloseBracket;
                break;
            case '|':
                this.nextChar();
                if (ch == '|') {
                    this.nextChar();
                    t = TokenIds.DoubleBar;
                }
                else {
                    t = TokenIds.Bar;
                }
                break;
            case '"':
            case '\'':
                var quote = this.ch;
                do {
                    this.nextChar();
                    while (this.textPos < this.textLen && this.ch != quote)
                        this.nextChar();
                    if (this.textPos == this.textLen)
                        throw Errors.unterminatedStringLiteral(this.textPos);
                    //throw ParseError(textPos, Res.UnterminatedStringLiteral);
                    this.nextChar();
                } while (this.ch == quote);
                t = TokenIds.StringLiteral;
                break;
            default:
                if (this.isLetter(this.ch)) {
                    do {
                        this.nextChar();
                    } while (this.isLetter(this.ch) || this.isDigit(this.ch) || this.ch == '_');
                    t = TokenIds.Identifier;
                    break;
                }
                if (this.isDigit(this.ch)) {
                    t = TokenIds.IntegerLiteral;
                    do {
                        this.nextChar();
                    } while (this.isDigit(this.ch));
                    if (this.ch == '.') {
                        t = TokenIds.RealLiteral;
                        this.nextChar();
                        this.validateDigit();
                        do {
                            this.nextChar();
                        } while (this.isDigit(this.ch));
                    }
                    break;
                }
                // if (this.isDigit(this.ch)) {
                //     t = TokenIds.IntegerLiteral;
                //     do {
                //         this.nextChar();
                //     } while (this.isDigit(this.ch));
                //     break;
                // }
                // if (this.ch == '.') {
                //     t = TokenIds.RealLiteral;
                //     this.nextChar();
                //     do {
                //         this.nextChar();
                //     } while (this.isDigit(this.ch));
                //     break;
                // }
                if (this.textPos == this.textLen) {
                    t = TokenIds.End;
                    break;
                }
                throw Errors.parseError();
        }
        this.tokenText = this.text.substr(tokenPos, this.textPos - tokenPos);
        let id = t;
        let text = this.text.substr(tokenPos, this.textPos - tokenPos);
        let pos = tokenPos;
        this.token = { id, text, pos };
    }
    validateDigit() {
        if (!this.isDigit(this.ch))
            throw Errors.parseError();
    }
    parsePrimaryStart() {
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
                throw Errors.unknownToken(this.token); //Errors.create(`Unknowed token id "${this.token.id}"`); //ParseError(Res.ExpressionExpected);
        }
    }
    validateToken(expectedTokenId) {
        if (this.token.id != expectedTokenId) {
            throw Errors.unexpectedToken(expectedTokenId, this.token.id);
            // throw Errors.create(`Expect token "${expectedTokenId}", Actual is "${this.token.id}".`);
        }
    }
    parseIntegerLiteral() {
        var expr = new ConstantExpression(new Number(this.token.text));
        this.nextToken();
        return expr;
    }
    parseRealLiteral() {
        this.validateToken(TokenIds.RealLiteral);
        let text = this.token.text;
        let last = text[text.length - 1];
        let value = Number.parseFloat(text);
        let expr = new ConstantExpression(value);
        this.nextToken();
        return expr;
    }
    parseParenExpression() {
        this.validateToken(TokenIds.OpenParen);
        this.nextToken();
        var expr = this.parseExpression();
        this.validateToken(TokenIds.CloseParen);
        this.nextToken();
        return expr;
    }
    parseStringLiteral() {
        var text = this.token.text;
        var expr = new ConstantExpression(text.substr(1, text.length - 2));
        this.nextToken();
        return expr;
    }
    parseFunction() {
        let func = this.functions[this.tokenText];
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
    parseIdentifier() {
        var self = this;
        var constant = this.constants[this.tokenText.toLowerCase()];
        if (constant != null) {
            this.nextToken();
            return constant;
        }
        var func = this.functions[this.tokenText];
        if (func != null) {
            return this.parseFunction();
        }
        ;
        let name = this.tokenText;
        this.nextToken();
        while (this.token.id == TokenIds.Dot) {
            this.nextToken();
            name = name + '.' + this.token.text;
            this.nextToken();
        }
        let expr = new MemberExpression(name);
        return expr;
        // throw Errors.create(`Parse expression "${this.tokenText}" fail."`);
    }
    parsePrimary() {
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
                throw Errors.unknownToken(this.token); //Errors.create(`Unknowed token id "${this.token.id}"`); //ParseError(Res.ExpressionExpected);
        }
    }
    // -, !, not unary operators
    parseUnary() {
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
            expr = new UnaryExpression(op, expr);
            return expr;
        }
        return this.parsePrimary();
    }
    parseMultiplicative() {
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
    parseLogicalOr() {
        var left = this.parseLogicalAnd();
        if (this.token.text == '||' || this.token.text == 'or') {
            var op = this.token.text;
            this.nextToken();
            var right = this.parseLogicalAnd();
            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    parseLogicalAnd() {
        var left = this.parseComparison();
        if (this.token.text == TokenIds.DoubleAmphersand || this.token.id == TokenIds.Amphersand ||
            this.token.text == 'and') {
            var op = this.token.text;
            this.nextToken();
            var right = this.parseComparison();
            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    // =, ==, !=, <>, >, >=, <, <= operators
    parseComparison() {
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
    parseAdditive() {
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
    parseExpression() {
        var expr = this.parseLogicalOr();
        return expr;
    }
    parse() {
        this.nextToken();
        var expr = this.parseExpression();
        this.validateToken(TokenIds.End);
        return expr;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=expression.js.map