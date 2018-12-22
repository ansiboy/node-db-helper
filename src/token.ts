import errors, { Errors } from "./errors";

export type TokenId = string
export let TokenIds = {
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
}
export class Token {
    private ch: string;
    private textPos: number;
    private textLen: number;
    private expression: string;
    token: { id: string; text: string; pos: number; };

    constructor(text: string) {
        if (!text) throw errors.arugmentNull('text')

        this.expression = text
        this.textLen = text.length;

        this.textPos = 0
        this.ch = this.expression[0]
    }
    private nextChar() {
        if (this.textPos < this.textLen)
            this.textPos = this.textPos + 1;

        this.ch = this.textPos < this.textLen ? this.expression[this.textPos] : '\0';
    }
    private isLetter(s) {
        var patrn = /[A-Za-z]/;

        if (!patrn.exec(s))
            return false;
        return true;
    }
    private isDigit(s) {
        var patrn = /[0-9]/;

        if (!patrn.exec(s))
            return false;
        return true;
    }
    private validateDigit() {
        if (!this.isDigit(this.ch))
            throw Errors.parseError();
    }
    get text() {
        return this.token.text
    }
    get position() {
        return this.token.pos
    }
    get id(): TokenId {
        return this.token.id
    }
    next() {
        while (this.ch == ' ') {
            this.nextChar();
        }

        var t: TokenId = null;
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
                    while (this.textPos < this.textLen && this.ch != quote) this.nextChar();
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
                    }
                    while (this.isDigit(this.ch));
                    if (this.ch == '.') {
                        t = TokenIds.RealLiteral;
                        this.nextChar();
                        this.validateDigit();
                        do {
                            this.nextChar();
                        }
                        while (this.isDigit(this.ch));
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

        let id = t;
        let text = this.expression.substr(tokenPos, this.textPos - tokenPos);
        let pos = tokenPos;
        this.token = { id, text, pos };
    }
}