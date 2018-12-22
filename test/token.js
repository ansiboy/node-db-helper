const assert = require('assert');
const { Token } = require('../out/token')


describe('Test Parser.parseExpression function', function () {

    it("a and b and c", () => {
        let token = new Token("a and b and c")
        token.next()

        assert.equal(token.text, 'a')

        token.next()
        assert.equal(token.text, 'and')

        token.next()
        assert.equal(token.text, 'b')

        token.next()
        assert.equal(token.text, 'and')

        token.next()
        assert.equal(token.text, 'c')
    })

    it( "(type is not null)", () => {
        let token = new Token( "(type is not null)")
        token.next()

        assert.equal(token.text, '(')

        token.next()
        assert.equal(token.text, 'type')

        token.next()
        assert.equal(token.text, 'is')

        token.next()
        assert.equal(token.text, 'not')

        token.next()
        assert.equal(token.text, 'null')

        token.next()
        assert.equal(token.text, ')')

        token.next()
        assert.equal(token.text, '')
    })

})