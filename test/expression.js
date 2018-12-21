const assert = require('assert');
const { Parser } = require('../out/expression')

let expr = Parser.parseExpression('true or false')
console.log(expr)

if (typeof describe != 'function')
    return

describe('Test Parser.parseExpression function', function () {


    it('数字', () => {
        let expr = Parser.parseExpression('5')
        assert.notEqual(expr, null)

        expr = Parser.parseExpression('5.1')
        assert.notEqual(expr, null)
    })

    describe('测试布尔值', () => {

        let str = 'true'
        it('true', () => {
            let expr = Parser.parseExpression('true')
            assert.notEqual(expr, null)
        })

        it('false', () => {
            let expr = Parser.parseExpression('false')
            assert.notEqual(expr, null)
        })

        it('not false', () => {
            let expr = Parser.parseExpression('not false')
            assert.notEqual(expr, null)
        })

        it('not true', () => {
            let expr = Parser.parseExpression('not true')
            assert.notEqual(expr, null)
        })

        str = 'col is false'
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = 'col is true'
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = 'col is true'
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = 'col is not false'
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = 'col is not true'
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = 'type is not null'
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = `true and false`
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = `true and type is not null`
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = `type is not null and type is not null`
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = `true or false`
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })

        str = `(type is not null) or (type is not null)`
        it(str, () => {
            let expr = Parser.parseExpression(str)
            assert.notEqual(expr, null)
        })


        it('测试 =', function () {
            let expr = Parser.parseExpression('type = 5')
            assert.notEqual(expr, null)
        })
        it('测试 >', function () {
            let expr = Parser.parseExpression('type > 5')
            assert.notEqual(expr, null)

            expr = Parser.parseExpression("type is null")
            assert.notEqual(expr, null)
        })
    })
})

