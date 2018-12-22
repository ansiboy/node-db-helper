"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const expression_1 = require("../out/expression");
const { Token } = require('../out/token');
let expr = expression_1.Parser.parseExpression('a and b or c');
expr = expression_1.Parser.parseExpression('a or b and c');
describe('Test Parser.parseExpression function', function () {
    it('数字', () => {
        let expr = expression_1.Parser.parseExpression('5');
        assert.notEqual(expr, null);
        expr = expression_1.Parser.parseExpression('5.1');
        assert.notEqual(expr, null);
    });
    describe('测试布尔值', () => {
        let str = 'true';
        it('true', () => {
            let expr = expression_1.Parser.parseExpression('true');
            assert.notEqual(expr, null);
        });
        it('false', () => {
            let expr = expression_1.Parser.parseExpression('false');
            assert.notEqual(expr, null);
        });
        it('not false', () => {
            let expr = expression_1.Parser.parseExpression('not false');
            assert.notEqual(expr, null);
        });
        it('not true', () => {
            let expr = expression_1.Parser.parseExpression('not true');
            assert.notEqual(expr, null);
        });
        str = 'col is false';
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = 'col is true';
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = 'col is true';
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = 'col is not false';
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = 'col is not true';
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = 'type is not null';
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = `true and false`;
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = `true and type is not null`;
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = `type is not null and type is not null`;
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        str = `true or false`;
        it(str, () => {
            let expr = expression_1.Parser.parseExpression(str);
            assert.notEqual(expr, null);
        });
        it(`(type is not null)`, () => {
            let expr = expression_1.Parser.parseExpression(`(type is not null)`);
            assert.notEqual(expr, null);
        });
        it(`true and true and true`, () => {
            let expr = expression_1.Parser.parseExpression(`true and true and true`);
            assert.notEqual(expr, null);
        });
        it(`a and b and c`, () => {
            let expr = expression_1.Parser.parseExpression(`true and true and true`);
            assert.notEqual(expr, null);
        });
        it(`a and b or c`, () => {
            let expr = expression_1.Parser.parseExpression(`a and b or c`);
            assert.notEqual(expr, null);
            let expectedType;
            expectedType = "Binary";
            assert.equal(expr.type, expectedType);
            let b = expr;
            console.log(b);
            expectedType = "Binary";
            assert.equal(b.leftExpression.type, expectedType);
            expectedType = "Column";
            assert.equal(b.rightExpression.type, expectedType);
        });
        // it('测试 =', function () {
        //     let expr = Parser.parseExpression('type = 5')
        //     assert.notEqual(expr, null)
        // })
        // it('测试 >', function () {
        //     let expr = Parser.parseExpression('type > 5')
        //     assert.notEqual(expr, null)
        //     expr = Parser.parseExpression("type is null")
        //     assert.notEqual(expr, null)
        // })
    });
});
