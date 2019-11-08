const { throws, deepEqual } = require('assert');

const { MSTMassage } = require('./main.js');

describe('MSTMassage_Markdown', function testMSTMassage_Markdown() {

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


});
