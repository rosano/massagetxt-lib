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
			mainModule.MSTMassage('alfa\nbravo', '$input.alfa')
		}, /MSTErrorIdentifierNotValid/);
	});

	it('throws if identifier not valid based on input', function() {
		throws(function() {
			mainModule.MSTMassage('alfa\nbravo', '$input.last')
		}, /MSTErrorIdentifierNotValid/);
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

	it('throws', function() {
		throws(function() {
			mainModule._MSTMassageType(null);
		}, /MSTErrorInputNotValid/);
	});

});

describe('__MSTIsMarkdownParser', function test__MSTIsMarkdownParser () {

	it('returns false if not object', function () {
		deepEqual(mainModule.__MSTIsMarkdownParser(''), false);
	});

	it('returns false if null', function () {
		deepEqual(mainModule.__MSTIsMarkdownParser(null), false);
	});

	it('returns false if IsMarkdownParser not true', function () {
		deepEqual(mainModule.__MSTIsMarkdownParser({}), false);
	});
	
	it('returns true', function () {
		deepEqual(mainModule.__MSTIsMarkdownParser({ IsMarkdownParser: true }), true);
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
			MSTOperationCallback: mainModule._MSTOperations._MSTBypass
		}, {
			MSTOperationPattern: /^lines$/,
			MSTOperationInputTypes: 'String',
			MSTOperationCallback: mainModule._MSTOperations.MSTStringLines
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
			mainModule._MSTOperations.MSTStringMarkdown(null, {
				IsMarkdownParser: true,
			});
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not MarkdownParser', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringMarkdown('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns MarkdownTree', function () {
		deepEqual(mainModule._MSTOperations.MSTStringMarkdown('alfa', {
			IsMarkdownParser: true,
		}), {
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
	
	it('returns property access', function () {
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
				mainModule._MSTOperations._MSTObjectRemap('')(null)
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
