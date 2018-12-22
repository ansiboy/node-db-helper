export declare type TokenId = string;
export declare let TokenIds: {
    Amphersand: string;
    Asterisk: string;
    Bar: string;
    CloseParen: string;
    CloseBracket: string;
    Colon: string;
    Comma: string;
    Dot: string;
    DoubleBar: string;
    DoubleAmphersand: string;
    DoubleEqual: string;
    End: string;
    Equal: string;
    Exclamation: string;
    ExclamationEqual: string;
    GreaterThan: string;
    GreaterThanEqual: string;
    Identifier: string;
    IntegerLiteral: string;
    LessGreater: string;
    LessThan: string;
    LessThanEqual: string;
    /** 符号：- */
    Minus: string;
    RealLiteral: string;
    OpenBracket: string;
    OpenParen: string;
    Percent: string;
    Plus: string;
    Question: string;
    Semicolon: string;
    StringLiteral: string;
    Slash: string;
};
export declare class Token {
    private ch;
    private textPos;
    private textLen;
    private expression;
    token: {
        id: string;
        text: string;
        pos: number;
    };
    constructor(text: string);
    private nextChar;
    private isLetter;
    private isDigit;
    private validateDigit;
    readonly text: string;
    readonly position: number;
    readonly id: TokenId;
    next(): void;
}
