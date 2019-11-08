const { throws, deepEqual } = require('assert');

const { MSTMassage } = require('./main.js');

const uParser = require('unified')().use(require('remark-parse')).parse;

describe('MSTMassage_Markdown', function testMSTMassage_Markdown() {

	const uOptions = function () {
		return {
			MSTOptionMarkdownParser: uParser,
		};
	};

	it('throws if param3 not object', function() {
		throws(function() {
			MSTMassage('', '', null);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param3 with no MSTOptionMarkdownParser', function() {
		throws(function() {
			MSTMassage('', '$input.markdown', {});
		}, /MSTErrorMarkdownParserNotSet/);
	});

	it('throws if param3.MSTOptionMarkdownParser not valid', function() {
		throws(function() {
			MSTMassage('', '$input.markdown', {
				MSTOptionMarkdownParser: {},
			});
		}, /MSTErrorMarkdownParserNotValid/);
	});

	it('no method', function () {
		deepEqual(MSTMassage('# alfa\n', '$input.markdown', uOptions()), '# alfa\n');
	});

});
