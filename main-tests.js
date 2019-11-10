const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

describe('MSTMassage', function testMSTMassage() {

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule.MSTMassage(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule.MSTMassage('', null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns input', function () {
		deepEqual(mainModule.MSTMassage('alfa', ''), 'alfa');
	});

	it('parses expression', function () {
		deepEqual(mainModule.MSTMassage('alfa\nbravo', '$input.lines.last'), 'bravo');
	});

	it('throws if identifier not valid', function() {
		throws(function() {
			mainModule.MSTMassage('alfa\nbravo', '$input.alfa');
		}, /MSTErrorIdentifierNotValid/);
	});

	it('throws if identifier not valid based on input', function() {
		throws(function() {
			mainModule.MSTMassage('alfa\nbravo', '$input.last');
		}, /MSTErrorIdentifierNotValid/);
	});

});

describe('___MSTMassageOperationStrings', function test___MSTMassageOperationStrings() {

	it('returns array', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings(''), []);
	});

	it('parses variable', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa'), ['$alfa']);
	});

	it('ignores blank', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.'), ['$alfa']);
	});

	it('parses method single', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo'), ['$alfa', 'bravo']);
	});

	it('parses method multiple', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo.charlie'), ['$alfa', 'bravo', 'charlie']);
	});

	it('parses parentheses', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo(charlie)'), ['$alfa', 'bravo(charlie)']);
	});

	it('parses brackets', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo[charlie]'), ['$alfa', 'bravo', '[charlie]']);
	});

	it('parses nested expression', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo($charlie.delta(echo))'), ['$alfa', 'bravo($charlie.delta(echo))']);
	});

	it('parses parentheses from regular expressions', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo(/(.*)/)'), ['$alfa', 'bravo(/(.*)/)']);
	});

	it('parses escaped parentheses from regular expressions', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo(/\((.*)\)/)'), ['$alfa', 'bravo(/\((.*)\)/)']);
	});

	it('parses escaped parentheses from print expressions', function() {
		deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo(\(alfa\))'), ['$alfa', 'bravo(\(alfa\))']);
	});

	context('case', function () {
		
		it('parses key value syntax', function() {
			deepEqual(mainModule.___MSTMassageOperationStrings('$alfa.bravo(/(\\w+)/).charlie(name: $1)'), ['$alfa', 'bravo(/(\\w+)/)', 'charlie(name: $1)']);
		});
	
	});

});

describe('___MSTMassageIsVariable', function test___MSTMassageIsVariable() {

	it('returns false if no $', function() {
		deepEqual(mainModule.___MSTMassageIsVariable('alfa'), false);
	});

	it('returns false if not identifier', function() {
		deepEqual(mainModule.___MSTMassageIsVariable('$alfa bravo'), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.___MSTMassageIsVariable('$alfa'), true);
	});

});

describe('___MSTMassageIsIdentifier', function test___MSTMassageIsIdentifier() {

	it('returns false if empty', function() {
		deepEqual(mainModule.___MSTMassageIsIdentifier(''), false);
	});

	it('returns false if space', function() {
		deepEqual(mainModule.___MSTMassageIsIdentifier('alfa bravo'), false);
	});

	it('returns true if letters', function() {
		deepEqual(mainModule.___MSTMassageIsIdentifier('alfa'), true);
	});

	it('returns true if numbers', function() {
		deepEqual(mainModule.___MSTMassageIsIdentifier('123'), true);
	});

});

describe('_MSTMassageInputTypes', function test_MSTMassageInputTypes() {

	it('throws if not string', function() {
		throws(function() {
			mainModule._MSTMassageInputTypes(null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule._MSTMassageInputTypes(''), []);
	});

	it('excludes if blank', function() {
		deepEqual(mainModule._MSTMassageInputTypes(','), []);
	});

	it('includes if single', function() {
		deepEqual(mainModule._MSTMassageInputTypes('alfa'), ['alfa']);
	});

	it('includes if multiple', function() {
		deepEqual(mainModule._MSTMassageInputTypes('alfa,bravo'), ['alfa', 'bravo']);
	});

	it('trims whitespace', function() {
		deepEqual(mainModule._MSTMassageInputTypes('alfa , bravo'), ['alfa', 'bravo']);
	});

});

describe('_MSTMassageType', function test_MSTMassageType() {

	it('returns String if string', function() {
		deepEqual(mainModule._MSTMassageType(''), 'String');
	});

	it('returns Array if array', function() {
		deepEqual(mainModule._MSTMassageType([]), 'Array');
	});

	it('returns Object if object', function() {
		deepEqual(mainModule._MSTMassageType({}), 'Object');
	});

	it('returns Group if group', function() {
		deepEqual(mainModule._MSTMassageType({
			MSTGroupValue: {},
		}), 'Group');
	});

	it('returns MarkdownTree if MarkdownTree', function() {
		deepEqual(mainModule._MSTMassageType({
			MSTMarkdownTreeSource: '',
		}), 'MarkdownTree');
	});

	it('throws', function() {
		throws(function() {
			mainModule._MSTMassageType(null);
		}, /MSTErrorInputNotValid/);
	});

});

describe('__MSTIsMarkdownParser', function test__MSTIsMarkdownParser () {

	it('returns false if not function', function () {
		deepEqual(mainModule.__MSTIsMarkdownParser(null), false);
	});

	it('returns true', function () {
		deepEqual(mainModule.__MSTIsMarkdownParser(function () {}), true);
	});

});

describe('__MSTIsMarkdownTree', function test__MSTIsMarkdownTree () {

	it('returns false if not object', function () {
		deepEqual(mainModule.__MSTIsMarkdownTree(''), false);
	});

	it('returns false if null', function () {
		deepEqual(mainModule.__MSTIsMarkdownTree(null), false);
	});

	it('returns false if MSTMarkdownTreeSource not string', function () {
		deepEqual(mainModule.__MSTIsMarkdownTree({
			MSTMarkdownTreeSource: null,
		}), false);
	});
	
	it('returns true', function () {
		deepEqual(mainModule.__MSTIsMarkdownTree({ MSTMarkdownTreeSource: 'alfa' }), true);
	});

});

describe('__MSTIsGroup', function test__MSTIsGroup () {

	it('returns false if not object', function () {
		deepEqual(mainModule.__MSTIsGroup(''), false);
	});

	it('returns false if null', function () {
		deepEqual(mainModule.__MSTIsGroup(null), false);
	});

	it('returns false if MSTGroupValue not object', function () {
		deepEqual(mainModule.__MSTIsGroup({
			MSTGroupValue: null,
		}), false);
	});
	
	it('returns true', function () {
		deepEqual(mainModule.__MSTIsGroup({ MSTGroupValue: {} }), true);
	});

});

describe('__MSTGroupValue', function test__MSTGroupValue () {

	it('throws if param1 not valid', function() {
		throws(function() {
			mainModule.__MSTGroupValue({});
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns MSTGroupValue', function () {
		deepEqual(mainModule.__MSTGroupValue({ MSTGroupValue: {} }), {});
	});

});

describe('__MSTMassageOperations', function test__MSTMassageOperations() {

	it('returns array', function () {
		deepEqual(mainModule.__MSTMassageOperations(), [{
			MSTOperationPattern: /^\$?input$/,
			MSTOperationCallback: mainModule._MSTOperations._MSTBypass,
		}, {
			MSTOperationPattern: /^split\(([^]+)\)$/,
			MSTOperationInputTypes: 'String,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTStringSplit,
		}, {
			MSTOperationPattern: /^lines$/,
			MSTOperationInputTypes: 'String',
			MSTOperationCallback: mainModule._MSTOperations.MSTStringLines,
		}, {
			MSTOperationPattern: /^conform\(\/([^]+)\/(\w)?\)$/,
			MSTOperationInputTypes: 'String,Regex',
			MSTOperationCallback: mainModule._MSTOperations.MSTStringConform,
		}, {
			MSTOperationPattern: /^capture\(\/([^]+)\/(\w)?\)$/,
			MSTOperationInputTypes: 'String,Regex',
			MSTOperationCallback: mainModule._MSTOperations.MSTStringCapture,
		}, {
			MSTOperationPattern: /^prepend\(([^]+)\)$/,
			MSTOperationInputTypes: 'String,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTStringPrepend,
		}, {
			MSTOperationPattern: /^postpend\(([^]+)\)$/,
			MSTOperationInputTypes: 'String,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTStringPostpend,
		}, {
			MSTOperationPattern: /^first$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayFirst,
		}, {
			MSTOperationPattern: /^last$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayLast,
		}, {
			MSTOperationPattern: /^\[([^]+)\]$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayAccess,
		}, {
			MSTOperationPattern: /^reverse$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayReverse,
		}, {
			MSTOperationPattern: /^unique$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayUnique,
		}, {
			MSTOperationPattern: /^group\((\w+)\)$/,
			MSTOperationInputTypes: 'Array,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayGroup,
		}, {
			MSTOperationPattern: /^conform\(\/([^]+)\/(\w)?\)$/,
			MSTOperationInputTypes: 'Array,Regex',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayConform,
		}, {
			MSTOperationPattern: /^capture\(\/([^]+)\/(\w)?\)$/,
			MSTOperationInputTypes: 'Array,Regex',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayCapture,
		}, {
			MSTOperationPattern: /^remap\(([^]+)\)$/,
			MSTOperationInputTypes: 'Array,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayRemap,
		}, {
			MSTOperationPattern: /^print\(([^]+)\)$/,
			MSTOperationInputTypes: 'Array,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayPrint,
		}, {
			MSTOperationPattern: /^join\(([^]+)\)$/,
			MSTOperationInputTypes: 'Array,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTArrayJoin,
		}, {
			MSTOperationPattern: /^\[([^]+)\]$/,
			MSTOperationInputTypes: 'Object',
			MSTOperationCallback: mainModule._MSTOperations.MSTObjectAccess,
		}, {
			MSTOperationPattern: /^remap\(([^]+)\)$/,
			MSTOperationInputTypes: 'Object,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTObjectRemap,
		}, {
			MSTOperationPattern: /^print\(([^]+)\)$/,
			MSTOperationInputTypes: 'Object,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTObjectPrint,
		}]);
	});

});

describe('__MSTMassageOperationsMarkdown', function test__MSTMassageOperationsMarkdown() {

	it('returns array', function () {
		deepEqual(mainModule.__MSTMassageOperationsMarkdown(), [{
			MSTOperationPattern: /^markdown$/,
			MSTOperationInputTypes: 'String,MarkdownParser',
			MSTOperationCallback: mainModule._MSTOperations.MSTStringMarkdown,
		}, {
			MSTOperationPattern: /^sections$/,
			MSTOperationInputTypes: 'MarkdownTree',
			MSTOperationCallback: mainModule._MSTOperations.MSTMarkdownSections,
		}, {
			MSTOperationPattern: /^section\(([^]+)\)$/,
			MSTOperationInputTypes: 'MarkdownTree,String',
			MSTOperationCallback: mainModule._MSTOperations.MSTMarkdownSection,
		}, {
			MSTOperationPattern: /^items$/,
			MSTOperationInputTypes: 'MarkdownTree',
			MSTOperationCallback: mainModule._MSTOperations.MSTMarkdownItems,
		}, {
			MSTOperationPattern: /^paragraphs$/,
			MSTOperationInputTypes: 'MarkdownTree',
			MSTOperationCallback: mainModule._MSTOperations.MSTMarkdownParagraphs,
		}]);
	});

});

describe('_MSTMassageTerminate', function test_MSTMassageTerminate() {

	it('returns MSTGroupValue if Group', function () {
		const item = { alfa: 'bravo' };
		deepEqual(mainModule._MSTMassageTerminate({ MSTGroupValue: item }), JSON.stringify(item));
	});

	it('returns string if not string', function () {
		deepEqual(mainModule._MSTMassageTerminate(null), 'null');
	});

	it('returns input', function () {
		deepEqual(mainModule._MSTMassageTerminate('alfa'), 'alfa');
	});

});

describe('__MSTMassageTerminateFunction', function test__MSTMassageTerminateFunction() {

	it('returns JSON.stringify if not string', function () {
		deepEqual(mainModule.__MSTMassageTerminateFunction(null), JSON.stringify);
	});

	it('returns _MSTBypass', function () {
		deepEqual(mainModule.__MSTMassageTerminateFunction(''), mainModule._MSTOperations._MSTBypass);
	});

});

describe('_MSTBypass', function test_MSTBypass () {

	it('returns input', function () {
		let item = function () {};
		deepEqual(mainModule._MSTOperations._MSTBypass(item), item);
	});

});

describe('MSTStringSplit', function testMSTStringSplit () {
	
	it('throws if param1 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringSplit(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringSplit('', null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mainModule._MSTOperations.MSTStringSplit('', ''), []);
	});

	it('splits with delimiter', function () {
		deepEqual(mainModule._MSTOperations.MSTStringSplit('alfa bravo', ' '), ['alfa', 'bravo']);
	});

});

describe('MSTStringLines', function testMSTStringLines () {
	
	it('throws if not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringLines(null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mainModule._MSTOperations.MSTStringLines(''), []);
	});

	it('excludes if not filled', function () {
		deepEqual(mainModule._MSTOperations.MSTStringLines('\n'), []);
	});

	it('includes if filled', function () {
		deepEqual(mainModule._MSTOperations.MSTStringLines('alfa\nbravo\n'), ['alfa', 'bravo']);
	});

});

describe('MSTStringPrepend', function testMSTStringPrepend () {
	
	it('throws if param1 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringPrepend(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringPrepend('', null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mainModule._MSTOperations.MSTStringPrepend('', ''), '');
	});

	it('returns prepends param2', function () {
		deepEqual(mainModule._MSTOperations.MSTStringPrepend('alfa', 'bravo'), 'bravoalfa');
	});

});

describe('MSTStringPostpend', function testMSTStringPostpend () {
	
	it('throws if param1 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringPostpend(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringPostpend('', null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mainModule._MSTOperations.MSTStringPostpend('', ''), '');
	});

	it('returns postpends param2', function () {
		deepEqual(mainModule._MSTOperations.MSTStringPostpend('alfa', 'bravo'), 'alfabravo');
	});

});

describe('MSTStringConform', function testMSTStringConform () {

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringConform(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringConform('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns false if no match', function () {
		deepEqual(mainModule._MSTOperations.MSTStringConform('alfa', /bravo/), false);
	});
	
	it('returns true', function () {
		deepEqual(mainModule._MSTOperations.MSTStringConform('alfa', /alfa/), true);
	});

});

describe('MSTStringCapture', function testMSTStringCapture () {

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringCapture(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringCapture('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns array', function () {
		deepEqual(mainModule._MSTOperations.MSTStringCapture('alfa', /bravo/), []);
	});
	
	it('excludes if no capture', function () {
		deepEqual(mainModule._MSTOperations.MSTStringCapture('alfa', /alfa/), []);
	});
	
	it('includes if capture', function () {
		deepEqual(mainModule._MSTOperations.MSTStringCapture('alfa', /(alfa)/), [{ 1: 'alfa' }]);
	});

});

describe('MSTStringMarkdown', function testMSTStringMarkdown () {

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringMarkdown(null, function () {});
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not MarkdownParser', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringMarkdown('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns MarkdownTree', function () {
		deepEqual(mainModule._MSTOperations.MSTStringMarkdown('alfa', function () { return {}; }), {
			MSTMarkdownTreeSource: 'alfa',
		});
	});
	
});

describe('MSTArrayFirst', function testMSTArrayFirst () {

	it('throws if not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayFirst(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns undefined if none', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayFirst([]), undefined);
	});
	
	it('returns first item', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayFirst(['alfa', 'bravo']), 'alfa');
	});

});

describe('MSTArrayLast', function testMSTArrayLast () {

	it('throws if not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayLast(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns undefined if none', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayLast([]), undefined);
	});
	
	it('returns last item', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayLast(['alfa', 'bravo']), 'bravo');
	});

});

describe('MSTArrayAccess', function testMSTArrayAccess () {

	it('throws if param1 not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayAccess(null, 1);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns string if not defined', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayAccess(['alfa', 'bravo'], 2), '');
	});
	
	it('returns element if defined', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayAccess(['alfa', 'bravo'], 0), 'alfa');
	});

});

describe('MSTArrayReverse', function testMSTArrayReverse () {

	it('throws if not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayReverse(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns input', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayReverse([]), []);
	});
	
	it('reverses input', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayReverse(['alfa', 'bravo']), ['bravo', 'alfa']);
	});

});

describe('MSTArrayUnique', function testMSTArrayUnique () {

	it('throws if not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayUnique(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns input', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayUnique([]), []);
	});
	
	it('removes duplicates', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayUnique(['alfa', 'alfa']), ['alfa']);
	});

});

describe('MSTArrayConform', function testMSTArrayConform () {

	it('throws if param1 not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayConform(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayConform([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns input', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayConform([], /alfa/), []);
	});
	
	it('excludes if no match', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayConform(['alfa'], /bravo/), []);
	});
	
	it('includes', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayConform(['alfa'], /alfa/), ['alfa']);
	});

});

describe('MSTArrayCapture', function testMSTArrayCapture () {

	it('throws if param1 not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayCapture(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayCapture([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns input', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayCapture([], /alfa/), []);
	});
	
	it('excludes if no capture', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayCapture(['alfa'], /alfa/), []);
	});
	
	it('excludes if no match', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayCapture(['alfa'], /(bravo)/), []);
	});
	
	it('includes', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayCapture(['alfa'], /(alfa)/), [{ 1: 'alfa' }]);
	});

});

describe('MSTArrayRemap', function testMSTArrayRemap () {

	it('throws if param1 not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayRemap(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayRemap([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns array', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayRemap([], ''), []);
	});
	
	it('parses expression', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayRemap([{ alfa: 'bravo' }], 'charlie: $alfa'), [{ charlie: 'bravo' }]);
	});

});

describe('MSTArrayPrint', function testMSTArrayPrint () {

	it('throws if param1 not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayPrint(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayPrint([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns array', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayPrint([], ''), []);
	});
	
	it('prints expression', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayPrint([{ alfa: 'bravo' }], 'charlie $alfa'), ['charlie bravo']);
	});

});

describe('MSTArrayJoin', function testMSTArrayJoin () {

	it('throws if param1 not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayJoin(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayJoin([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns string', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayJoin([], ''), '');
	});
	
	it('joins items with param2', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayJoin(['alfa', 'bravo'], ','), 'alfa,bravo');
	});

});

describe('MSTArrayGroup', function testMSTArrayGroup () {

	it('throws if param1 not array', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayGroup(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTArrayGroup([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns Group', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayGroup([], ''), {
			MSTGroupKey: '',
			MSTGroupValue: {},
		});
	});
	
	it('groups by param2', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayGroup([{ alfa: 'bravo' }], 'alfa'), {
			MSTGroupKey: 'alfa',
			MSTGroupValue: {
				bravo: [{ alfa: 'bravo' }] },
		});
	});

});

describe('MSTObjectAccess', function testMSTObjectAccess () {

	it('throws if param1 not object', function() {
		throws(function() {
			mainModule._MSTOperations.MSTObjectRemap(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('returns property access', function () {
		deepEqual(mainModule._MSTOperations.MSTObjectAccess({ alfa: 'bravo' }, 'alfa'), 'bravo');
	});

});

describe('MSTObjectRemap', function testMSTObjectRemap () {

	it('throws if param1 not object', function() {
		throws(function() {
			mainModule._MSTOperations.MSTObjectRemap(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTObjectRemap({}, null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns object', function () {
		deepEqual(mainModule._MSTOperations.MSTObjectRemap({}, ''), {});
	});
	
	it('parses expression object', function () {
		deepEqual(mainModule._MSTOperations.MSTObjectRemap({ alfa: 'bravo' }, 'charlie: $alfa'), { charlie: 'bravo' });
	});

});

describe('_MSTObjectRemap', function test_MSTObjectRemap () {

	it('throws if not string', function() {
		throws(function() {
			mainModule._MSTOperations._MSTObjectRemap(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns function', function () {
		deepEqual(typeof mainModule._MSTOperations._MSTObjectRemap(''), 'function');
	});

	context('callback', function () {
		
		it('throws if not object', function () {
			throws(function () {
				mainModule._MSTOperations._MSTObjectRemap('')(null);
			}, /MSTErrorInputNotValid/);
		});

		it('returns object', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap('')({}), {});
		});

		it('excludes if no key', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap(': $1')({ 1: 2 }), {});
		});

		it('excludes if no sign', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap('alfa: 1')({ 1: 2 }), {});
		});

		it('excludes if no colon', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap('alfa $1')({ 1: 2 }), {});
		});

		it('excludes if multiple colons', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap('alfa: $1: bravo')({ 1: 2 }), {});
		});

		it('excludes if no match', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap('alfa: $0')({ 1: 2 }), {});
		});

		it('includes if match', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap('alfa: $1')({ 1: 2 }), { alfa: 2 });
		});

		it('includes if no whitespace', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap('alfa:$1')({ 1: 2 }), { alfa: 2 });
		});

		it('includes multiple', function () {
			deepEqual(mainModule._MSTOperations._MSTObjectRemap('alfa: $1, bravo: $3')({ 1: 2, 3: 4 }), { alfa: 2, bravo: 4 });
		});
	
	});

});

describe('MSTObjectPrint', function testMSTObjectPrint () {

	it('throws if param1 not object', function() {
		throws(function() {
			mainModule._MSTOperations.MSTObjectPrint(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTObjectPrint({}, null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns param2', function () {
		deepEqual(mainModule._MSTOperations.MSTObjectPrint({}, 'alfa'), 'alfa');
	});
	
	it('substitutes variable', function () {
		deepEqual(mainModule._MSTOperations.MSTObjectPrint({ alfa: 'bravo' }, 'charlie $alfa'), 'charlie bravo');
	});

});

const uParser = require('unified')().use(require('remark-parse')).parse;

const uTree = function (inputData) {
	return mainModule._MSTOperations.MSTStringMarkdown(inputData, uParser);
};

describe('MSTMarkdownSections', function testMSTMarkdownSections () {

	const uSources = function (inputData) {
		return mainModule._MSTOperations.MSTMarkdownSections(uTree(inputData)).map(function (e) {
			return e.MSTMarkdownTreeSource;
		});
	};

	it('throws if not MarkdownTree', function() {
		throws(function() {
			mainModule._MSTOperations.MSTMarkdownSections({});
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(uSources(''), []);
	});

	it('includes single line if no heading', function () {
		deepEqual(uSources('alfa'), ['alfa']);
	});

	it('includes multiple line if no heading', function () {
		deepEqual(uSources('alfa\nbravo'), ['alfa\nbravo']);
	});

	it('includes multiple paragraphs if no heading', function () {
		deepEqual(uSources('alfa\n\nbravo'), ['alfa\n\nbravo']);
	});

	it('includes if heading', function () {
		deepEqual(uSources('# alfa'), ['# alfa']);
	});

	it('includes initial section if heading', function () {
		deepEqual(uSources('alfa\n# bravo'), ['alfa', '# bravo']);
	});

	it('includes multiple paragraphs if heading', function () {
		deepEqual(uSources('alfa\n# bravo\n\n charlie'), ['alfa', '# bravo\n\n charlie']);
	});

	it.skip('nests secondary sections', function () {
		deepEqual(uSources('alfa\n# bravo\n## charlie\ndelta'), ['alfa', '# bravo\n## charlie\ndelta']);
	});
	
});

describe('MSTMarkdownSection', function testMSTMarkdownSection () {

	const uSource = function (param1, param2) {
		return mainModule._MSTOperations.MSTMarkdownSection(uTree(param1), param2);
	};

	it('throws if param1 not MarkdownTree', function() {
		throws(function() {
			mainModule._MSTOperations.MSTMarkdownSection({}, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTMarkdownSection(uTree(''), null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns string if not defined', function () {
		deepEqual(uSource('', ''), '');
	});

	it('returns string if defined with no lines', function () {
		deepEqual(uSource('# alfa', 'alfa'), '');
	});

	it('returns MarkdownTree', function () {
		deepEqual(uSource('# alfa\nbravo', 'alfa').MSTMarkdownTreeSource, 'bravo');
	});
	
});

describe('MSTMarkdownItems', function testMSTMarkdownItems () {

	it('throws if not MarkdownTree', function() {
		throws(function() {
			mainModule._MSTOperations.MSTMarkdownItems({});
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mainModule._MSTOperations.MSTMarkdownItems(uTree('')), []);
	});

	it('excludes non bullets', function () {
		deepEqual(mainModule._MSTOperations.MSTMarkdownItems(uTree('alfa')), []);
	});

	it('includes hyphenated', function () {
		deepEqual(mainModule._MSTOperations.MSTMarkdownItems(uTree('- alfa\n- bravo')), ['alfa', 'bravo']);
	});

	it('includes starred', function () {
		deepEqual(mainModule._MSTOperations.MSTMarkdownItems(uTree('* alfa\n* bravo')), ['alfa', 'bravo']);
	});
	
});


describe('MSTMarkdownParagraphs', function testMSTMarkdownParagraphs () {

	it('throws if not MarkdownTree', function() {
		throws(function() {
			mainModule._MSTOperations.MSTMarkdownParagraphs({});
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mainModule._MSTOperations.MSTMarkdownParagraphs(uTree('')), []);
	});

	it('includes single line', function () {
		deepEqual(mainModule._MSTOperations.MSTMarkdownParagraphs(uTree('alfa')), ['alfa']);
	});

	it('includes multiple line', function () {
		deepEqual(mainModule._MSTOperations.MSTMarkdownParagraphs(uTree('alfa\nbravo')), ['alfa\nbravo']);
	});

	it('includes multiple paragraphs', function () {
		deepEqual(mainModule._MSTOperations.MSTMarkdownParagraphs(uTree('alfa\nbravo\n\ncharlie\ndelta')), ['alfa\nbravo', 'charlie\ndelta']);
	});
	
});
