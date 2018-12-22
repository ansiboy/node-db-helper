"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
exports.TokenIds = {
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
class Token {
    constructor(text) {
        if (!text)
            throw errors_1.default.arugmentNull('text');
        this.expression = text;
        this.textLen = text.length;
        this.textPos = 0;
        this.ch = this.expression[0];
    }
    nextChar() {
        if (this.textPos < this.textLen)
            this.textPos = this.textPos + 1;
        this.ch = this.textPos < this.textLen ? this.expression[this.textPos] : '\0';
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
    validateDigit() {
        if (!this.isDigit(this.ch))
            throw errors_1.Errors.parseError();
    }
    get text() {
        return this.token.text;
    }
    get position() {
        return this.token.pos;
    }
    get id() {
        return this.token.id;
    }
    next() {
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
                    t = exports.TokenIds.ExclamationEqual;
                }
                else {
                    t = exports.TokenIds.Exclamation;
                }
                break;
            case '%':
                this.nextChar;
                t = exports.TokenIds.Percent;
                break;
            case '&':
                this.nextChar();
                if (this.ch == '&') {
                    this.nextChar();
                    t = exports.TokenIds.DoubleAmphersand;
                }
                else {
                    t = exports.TokenIds.Amphersand;
                }
                break;
            case '(':
                this.nextChar();
                t = exports.TokenIds.OpenParen;
                break;
            case ')':
                this.nextChar();
                t = exports.TokenIds.CloseParen;
                break;
            case '*':
                this.nextChar();
                t = exports.TokenIds.Asterisk;
                break;
            case '+':
                this.nextChar();
                t = exports.TokenIds.Plus;
                break;
            case ',':
                this.nextChar();
                t = exports.TokenIds.Comma;
                break;
            case ';':
                this.nextChar();
                t = exports.TokenIds.Semicolon;
                break;
            case '-':
                this.nextChar();
                t = exports.TokenIds.Minus;
                break;
            case '.':
                this.nextChar();
                t = exports.TokenIds.Dot;
                break;
            case '/':
                this.nextChar();
                t = exports.TokenIds.Slash;
                break;
            case ':':
                this.nextChar();
                t = exports.TokenIds.Colon;
                break;
            case '<':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = exports.TokenIds.LessThanEqual;
                }
                else if (this.ch == '>') {
                    this.nextChar();
                    t = exports.TokenIds.LessGreater;
                }
                else {
                    t = exports.TokenIds.LessThan;
                }
                break;
            case '=':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = exports.TokenIds.DoubleEqual;
                }
                else {
                    t = exports.TokenIds.Equal;
                }
                break;
            case '>':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = exports.TokenIds.GreaterThanEqual;
                }
                else {
                    t = exports.TokenIds.GreaterThan;
                }
                break;
            case '?':
                this.nextChar();
                t = exports.TokenIds.Question;
                break;
            case '[':
                this.nextChar();
                t = exports.TokenIds.OpenBracket;
                break;
            case ']':
                this.nextChar();
                t = exports.TokenIds.CloseBracket;
                break;
            case '|':
                this.nextChar();
                if (ch == '|') {
                    this.nextChar();
                    t = exports.TokenIds.DoubleBar;
                }
                else {
                    t = exports.TokenIds.Bar;
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
                        throw errors_1.Errors.unterminatedStringLiteral(this.textPos);
                    //throw ParseError(textPos, Res.UnterminatedStringLiteral);
                    this.nextChar();
                } while (this.ch == quote);
                t = exports.TokenIds.StringLiteral;
                break;
            default:
                if (this.isLetter(this.ch)) {
                    do {
                        this.nextChar();
                    } while (this.isLetter(this.ch) || this.isDigit(this.ch) || this.ch == '_');
                    t = exports.TokenIds.Identifier;
                    break;
                }
                if (this.isDigit(this.ch)) {
                    t = exports.TokenIds.IntegerLiteral;
                    do {
                        this.nextChar();
                    } while (this.isDigit(this.ch));
                    if (this.ch == '.') {
                        t = exports.TokenIds.RealLiteral;
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
                    t = exports.TokenIds.End;
                    break;
                }
                throw errors_1.Errors.parseError();
        }
        let id = t;
        let text = this.expression.substr(tokenPos, this.textPos - tokenPos);
        let pos = tokenPos;
        this.token = { id, text, pos };
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map