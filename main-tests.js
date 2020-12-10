const { throws, deepEqual } = require('assert');

const mod = require('./main.js');

describe('MSTMassage', function test_MSTMassage() {

	it('throws if param1 not string', function() {
		throws(function() {
			mod.MSTMassage(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod.MSTMassage('', null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns input', function () {
		deepEqual(mod.MSTMassage('alfa', ''), 'alfa');
	});

	it('parses expression', function () {
		deepEqual(mod.MSTMassage('alfa\nbravo', '$input.lines.last'), 'bravo');
	});

	it('throws if identifier not valid', function() {
		throws(function() {
			mod.MSTMassage('alfa\nbravo', '$input.alfa');
		}, /MSTErrorIdentifierNotValid/);
	});

	it('throws if identifier not valid based on input', function() {
		throws(function() {
			mod.MSTMassage('alfa\nbravo', '$input.last');
		}, /MSTErrorIdentifierNotValid/);
	});

	context('MSTOptionTrace', function () {

		it('throws if not function', function() {
			throws(function() {
				mod.MSTMassage('alfa', '$input', {
					MSTOptionTrace: null,
				});
			}, /MSTErrorInputNotValid/);
		});

		it('includes operation', function () {
			let item = [];
			
			mod.MSTMassage('alfa', '$input', {
				MSTOptionTrace () { item.push(...arguments) },
			});

			deepEqual(item, [
				[0, 'MSTTraceOperation', '$input'],
				[0, 'MSTTraceInput', 'alfa'],
				]);
		});

		it('includes input', function () {
			let item = [];
			
			mod.MSTMassage('alfa', '$input.lines', {
				MSTOptionTrace () { item.push(...arguments) },
			});

			deepEqual(item, [
				[0, 'MSTTraceOperation', '$input'],
				[1, 'MSTTraceOperation', 'lines'],
				[0, 'MSTTraceInput', 'alfa'],
				[1, 'MSTTraceInput', 'alfa'],
				]);
		});

		it('includes arguments', function () {
			let item = [];
			
			mod.MSTMassage('alfa', '$input.lines.join(-)', {
				MSTOptionTrace () { item.push(...arguments) },
			});

			deepEqual(item, [
				[0, 'MSTTraceOperation', '$input'],
				[1, 'MSTTraceOperation', 'lines'],
				[2, 'MSTTraceOperation', 'join(-)'],
				[0, 'MSTTraceInput', 'alfa'],
				[1, 'MSTTraceInput', 'alfa'],
				[2, 'MSTTraceInput', ['alfa']],
				[2, 'MSTTraceArguments', ['-']],
				]);
		});

		context('markdown', function () {
			
			const uParser = require('unified')().use(require('remark-parse')).parse;

			it('includes arguments', function () {
				let item = [];
				
				mod.MSTMassage('alfa', '$input.markdown.paragraphs', {
					MSTOptionMarkdownParser: uParser,
					MSTOptionTrace () { item.push(...arguments) },
				});

				deepEqual(JSON.stringify(item), JSON.stringify([
					[0, 'MSTTraceOperation', '$input'],
					[1, 'MSTTraceOperation', 'markdown'],
					[2, 'MSTTraceOperation', 'paragraphs'],
					[0, 'MSTTraceInput', 'alfa'],
					[1, 'MSTTraceInput', 'alfa'],
					[1, 'MSTTraceArguments', [uParser]],
					[2, 'MSTTraceInput', 'alfa'],
					]));
			});
		
		});
	
	});

});

describe('___MSTMassageOperationStrings', function test___MSTMassageOperationStrings() {

	it('returns array', function() {
		deepEqual(mod.___MSTMassageOperationStrings(''), []);
	});

	context('variable', function () {

		it('throws if no marker', function() {
			throws(function() {
				mod.___MSTMassageOperationStrings('alfa');
			}, /MSTSyntaxErrorNoStartingVariable/);
		});

		it('throws if no identifier', function() {
			throws(function() {
				mod.___MSTMassageOperationStrings('$');
			}, /MSTSyntaxErrorNoStartingVariable/);
		});

		it.skip('throws if not valid', function() {
			throws(function() {
				mod.___MSTMassageOperationStrings('$alfa bravo');
			}, /MSTSyntaxErrorNoStartingVariable/);
		});

		it('includes', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa'), ['$alfa']);
		});
	
	});

	context('method', function () {
		
		it('excludes if blank', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa.'), ['$alfa']);
		});

		it('excludes if not valid', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo charlie'), ['$alfa', 'bravo']);
		});

		it('includes single', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo'), ['$alfa', 'bravo']);
		});

		it('includes multiple', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo.charlie'), ['$alfa', 'bravo', 'charlie']);
		});
	
	});

	context('parentheses', function () {

		context('format', function () {

			it('throws if no closing brace', function () {
				throws(function () {
					mod.___MSTMassageOperationStrings('$alfa.bravo(charlie');
				}, /MSTSyntaxErrorNoClosingParenthesis/);
			});
			
			it('parses string', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(charlie)'), ['$alfa', 'bravo(charlie)']);
			});

			it('parses escaped parentheses', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(\\(alfa\\))'), ['$alfa', 'bravo(\\(alfa\\))']);
			});

			it('parses variable', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo($charlie)'), ['$alfa', 'bravo($charlie)']);
			});

			it('parses methods', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo($charlie.delta(echo))'), ['$alfa', 'bravo($charlie.delta(echo))']);
			});
		
		});
		
		context('regular expression', function () {

			it('ignores unescaped brackets', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(/[.]*/)'), ['$alfa', 'bravo(/[.]*/)']);
			});
			
			it('ignores unescaped parentheses', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(/(.*)/)'), ['$alfa', 'bravo(/(.*)/)']);
			});
			
			it('ignores escaped parentheses', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(/\((.*)\)/)'), ['$alfa', 'bravo(/\((.*)\)/)']);
			});
		
		});

		context('mapping', function () {

			it('parses pair variable single', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(charlie: $delta)'), ['$alfa', 'bravo(charlie: $delta)']);
			});

			it('parses pair variable multiple', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(charlie: $delta, echo: $foxtrot)'), ['$alfa', 'bravo(charlie: $delta, echo: $foxtrot)']);
			});

			it('parses pair methods', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(charlie: $delta.echo)'), ['$alfa', 'bravo(charlie: $delta.echo)']);
			});

			it('parses pair method parentheses', function() {
				deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(charlie: $delta.echo(foxtrot))'), ['$alfa', 'bravo(charlie: $delta.echo(foxtrot))']);
			});
			
		});
	
	});

	context('brackets', function () {
		
		it('parses string', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo[charlie]'), ['$alfa', 'bravo', '[charlie]']);
		});
	
	});

	context('case', function () {
		
		it('parses escaped line break', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo.charlie(\\n)'), ['$alfa', 'bravo', 'charlie(\\n)']);
		});
		
		it('parses key value syntax', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(/(\\w+)/).charlie(delta: $1, echo: $1)'), ['$alfa', 'bravo(/(\\w+)/)', 'charlie(delta: $1, echo: $1)']);
		});
		
		it('parses multiple delegates', function() {
			deepEqual(mod.___MSTMassageOperationStrings('$alfa.bravo(/(\\w+)/).charlie(delta: $1, echo: $1).foxtrot(- $golf)'), ['$alfa', 'bravo(/(\\w+)/)', 'charlie(delta: $1, echo: $1)', 'foxtrot(- $golf)']);
		});
	
	});

});

describe('___MSTMassageIsVariable', function test___MSTMassageIsVariable() {

	it('returns false if no $', function() {
		deepEqual(mod.___MSTMassageIsVariable('alfa'), false);
	});

	it('returns false if not identifier', function() {
		deepEqual(mod.___MSTMassageIsVariable('$alfa bravo'), false);
	});

	it('returns true', function() {
		deepEqual(mod.___MSTMassageIsVariable('$alfa'), true);
	});

});

describe('___MSTMassageIsIdentifier', function test___MSTMassageIsIdentifier() {

	it('returns false if empty', function() {
		deepEqual(mod.___MSTMassageIsIdentifier(''), false);
	});

	it('returns false if space', function() {
		deepEqual(mod.___MSTMassageIsIdentifier('alfa bravo'), false);
	});

	it('returns true if letters', function() {
		deepEqual(mod.___MSTMassageIsIdentifier('alfa'), true);
	});

	it('returns true if numbers', function() {
		deepEqual(mod.___MSTMassageIsIdentifier('123'), true);
	});

});

describe('_MSTMassageInputTypes', function test_MSTMassageInputTypes() {

	it('throws if not string', function() {
		throws(function() {
			mod._MSTMassageInputTypes(null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mod._MSTMassageInputTypes(''), []);
	});

	it('excludes if blank', function() {
		deepEqual(mod._MSTMassageInputTypes(','), []);
	});

	it('includes if single', function() {
		deepEqual(mod._MSTMassageInputTypes('alfa'), ['alfa']);
	});

	it('includes if multiple', function() {
		deepEqual(mod._MSTMassageInputTypes('alfa,bravo'), ['alfa', 'bravo']);
	});

	it('trims whitespace', function() {
		deepEqual(mod._MSTMassageInputTypes('alfa , bravo'), ['alfa', 'bravo']);
	});

});

describe('_MSTMassageType', function test_MSTMassageType() {

	it('returns String if string', function() {
		deepEqual(mod._MSTMassageType(''), 'String');
	});

	it('returns Array if array', function() {
		deepEqual(mod._MSTMassageType([]), 'Array');
	});

	it('returns Object if object', function() {
		deepEqual(mod._MSTMassageType({}), 'Object');
	});

	it('returns Group if group', function() {
		deepEqual(mod._MSTMassageType({
			MSTGroupValue: {},
		}), 'Group');
	});

	it('returns MarkdownTree if MarkdownTree', function() {
		deepEqual(mod._MSTMassageType({
			MSTMarkdownTreeSource: '',
		}), 'MarkdownTree');
	});

	it('throws', function() {
		throws(function() {
			mod._MSTMassageType(null);
		}, /MSTErrorInputNotValid/);
	});

});

describe('__MSTIsMarkdownParser', function test__MSTIsMarkdownParser () {

	it('returns false if not function', function () {
		deepEqual(mod.__MSTIsMarkdownParser(null), false);
	});

	it('returns true', function () {
		deepEqual(mod.__MSTIsMarkdownParser(function () {}), true);
	});

});

describe('__MSTIsMarkdownTree', function test__MSTIsMarkdownTree () {

	it('returns false if not object', function () {
		deepEqual(mod.__MSTIsMarkdownTree(''), false);
	});

	it('returns false if null', function () {
		deepEqual(mod.__MSTIsMarkdownTree(null), false);
	});

	it('returns false if MSTMarkdownTreeSource not string', function () {
		deepEqual(mod.__MSTIsMarkdownTree({
			MSTMarkdownTreeSource: null,
		}), false);
	});
	
	it('returns true', function () {
		deepEqual(mod.__MSTIsMarkdownTree({ MSTMarkdownTreeSource: 'alfa' }), true);
	});

});

describe('__MSTIsGroup', function test__MSTIsGroup () {

	it('returns false if not object', function () {
		deepEqual(mod.__MSTIsGroup(''), false);
	});

	it('returns false if null', function () {
		deepEqual(mod.__MSTIsGroup(null), false);
	});

	it('returns false if MSTGroupValue not object', function () {
		deepEqual(mod.__MSTIsGroup({
			MSTGroupValue: null,
		}), false);
	});
	
	it('returns true', function () {
		deepEqual(mod.__MSTIsGroup({ MSTGroupValue: {} }), true);
	});

});

describe('__MSTGroupValue', function test__MSTGroupValue () {

	it('throws if param1 not valid', function() {
		throws(function() {
			mod.__MSTGroupValue({});
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns MSTGroupValue', function () {
		deepEqual(mod.__MSTGroupValue({ MSTGroupValue: {} }), {});
	});

});

describe('__MSTMassageOperations', function test__MSTMassageOperations() {

	it('returns array', function () {
		deepEqual(mod.__MSTMassageOperations(), [{
			MSTOperationPattern: /^\$?input$/,
			MSTOperationCallback: mod._MSTOperations._MSTBypass,
		}, {
			MSTOperationPattern: /^lowercase$/,
			MSTOperationInputTypes: 'String',
			MSTOperationCallback: mod._MSTOperations.MSTStringLowercase,
		}, {
			MSTOperationPattern: /^split\(([^]+)\)$/,
			MSTOperationInputTypes: 'String,String',
			MSTOperationCallback: mod._MSTOperations.MSTStringSplit,
		}, {
			MSTOperationPattern: /^lines$/,
			MSTOperationInputTypes: 'String',
			MSTOperationCallback: mod._MSTOperations.MSTStringLines,
		}, {
			MSTOperationPattern: /^conform\(\/([^]+)\/(\w)?\)$/,
			MSTOperationInputTypes: 'String,Regex',
			MSTOperationCallback: mod._MSTOperations.MSTStringConform,
		}, {
			MSTOperationPattern: /^capture\(\/([^]+)\/(\w)?\)$/,
			MSTOperationInputTypes: 'String,Regex',
			MSTOperationCallback: mod._MSTOperations.MSTStringCapture,
		}, {
			MSTOperationPattern: /^prepend\(([^]+)\)$/,
			MSTOperationInputTypes: 'String,String',
			MSTOperationCallback: mod._MSTOperations.MSTStringPrepend,
		}, {
			MSTOperationPattern: /^postpend\(([^]+)\)$/,
			MSTOperationInputTypes: 'String,String',
			MSTOperationCallback: mod._MSTOperations.MSTStringPostpend,
		}, {
			MSTOperationPattern: /^first$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mod._MSTOperations.MSTArrayFirst,
		}, {
			MSTOperationPattern: /^last$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mod._MSTOperations.MSTArrayLast,
		}, {
			MSTOperationPattern: /^\[([^]+)\]$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mod._MSTOperations.MSTArrayAccess,
		}, {
			MSTOperationPattern: /^reverse$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mod._MSTOperations.MSTArrayReverse,
		}, {
			MSTOperationPattern: /^unique$/,
			MSTOperationInputTypes: 'Array',
			MSTOperationCallback: mod._MSTOperations.MSTArrayUnique,
		}, {
			MSTOperationPattern: /^group\((\w+)\)$/,
			MSTOperationInputTypes: 'Array,String',
			MSTOperationCallback: mod._MSTOperations.MSTArrayGroup,
		}, {
			MSTOperationPattern: /^conform\(\/([^]+)\/(\w)?\)$/,
			MSTOperationInputTypes: 'Array,Regex',
			MSTOperationCallback: mod._MSTOperations.MSTArrayConform,
		}, {
			MSTOperationPattern: /^capture\(\/([^]+)\/(\w)?\)$/,
			MSTOperationInputTypes: 'Array,Regex',
			MSTOperationCallback: mod._MSTOperations.MSTArrayCapture,
		}, {
			MSTOperationPattern: /^remap\(([^]+)\)$/,
			MSTOperationInputTypes: 'Array,Mapping',
			MSTOperationCallback: mod._MSTOperations.MSTArrayRemap,
		// }, {
		// 	MSTOperationPattern: /^print\(([^]+)\)$/,
		// 	MSTOperationInputTypes: 'Array,String',
		// 	MSTOperationCallback: mod._MSTOperations.MSTArrayPrint,
		}, {
			MSTOperationPattern: /^join\(([^]+)\)$/,
			MSTOperationInputTypes: 'Array,String',
			MSTOperationCallback: mod._MSTOperations.MSTArrayJoin,
		}, {
			MSTOperationPattern: /^\[([^]+)\]$/,
			MSTOperationInputTypes: 'Object',
			MSTOperationCallback: mod._MSTOperations.MSTObjectAccess,
		}, {
			MSTOperationPattern: /^remap\(([^]+)\)$/,
			MSTOperationInputTypes: 'Object,Mapping',
			MSTOperationCallback: mod._MSTOperations.MSTObjectRemap,
		}, {
			MSTOperationPattern: /^print\(([^]+)\)$/,
			MSTOperationInputTypes: 'Object,String',
			MSTOperationCallback: mod._MSTOperations.MSTObjectPrint,
		}]);
	});

});

describe('__MSTMassageOperationsMarkdown', function test__MSTMassageOperationsMarkdown() {

	it('returns array', function () {
		deepEqual(mod.__MSTMassageOperationsMarkdown(), [{
			MSTOperationPattern: /^markdown$/,
			MSTOperationInputTypes: 'String,MarkdownParser',
			MSTOperationCallback: mod._MSTOperations.MSTStringMarkdown,
		}, {
			MSTOperationPattern: /^sections$/,
			MSTOperationInputTypes: 'MarkdownTree',
			MSTOperationCallback: mod._MSTOperations.MSTMarkdownSections,
		}, {
			MSTOperationPattern: /^content\(([^]+)\)$/,
			MSTOperationInputTypes: 'MarkdownTree,String',
			MSTOperationCallback: mod._MSTOperations.MSTMarkdownContent,
		}, {
			MSTOperationPattern: /^items$/,
			MSTOperationInputTypes: 'MarkdownTree',
			MSTOperationCallback: mod._MSTOperations.MSTMarkdownItems,
		}, {
			MSTOperationPattern: /^paragraphs$/,
			MSTOperationInputTypes: 'MarkdownTree',
			MSTOperationCallback: mod._MSTOperations.MSTMarkdownParagraphs,
		}]);
	});

});

describe('_MSTMassageTerminate', function test_MSTMassageTerminate() {

	it('returns MSTGroupValue if Group', function () {
		const item = { alfa: 'bravo' };
		deepEqual(mod._MSTMassageTerminate({ MSTGroupValue: item }), JSON.stringify(item));
	});

	it('returns string if not string', function () {
		deepEqual(mod._MSTMassageTerminate(null), 'null');
	});

	it('returns input', function () {
		deepEqual(mod._MSTMassageTerminate('alfa'), 'alfa');
	});

});

describe('__MSTMassageTerminateFunction', function test__MSTMassageTerminateFunction() {

	it('returns JSON.stringify if not string', function () {
		deepEqual(mod.__MSTMassageTerminateFunction(null), JSON.stringify);
	});

	it('returns _MSTBypass', function () {
		deepEqual(mod.__MSTMassageTerminateFunction(''), mod._MSTOperations._MSTBypass);
	});

});

describe('_MSTBypass', function test_MSTBypass () {

	it('returns input', function () {
		let item = function () {};
		deepEqual(mod._MSTOperations._MSTBypass(item), item);
	});

});

describe('MSTStringLowercase', function test_MSTStringLowercase () {
	
	it('throws if not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringLowercase(null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mod._MSTOperations.MSTStringLowercase(''), '');
	});

	it('converts to lower case', function () {
		deepEqual(mod._MSTOperations.MSTStringLowercase('ALFA'), 'alfa');
	});

});

describe('MSTStringSplit', function test_MSTStringSplit () {
	
	it('throws if param1 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringSplit(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringSplit('', null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mod._MSTOperations.MSTStringSplit('', ''), []);
	});

	it('splits with delimiter', function () {
		deepEqual(mod._MSTOperations.MSTStringSplit('alfa bravo', ' '), ['alfa', 'bravo']);
	});

});

describe('MSTStringLines', function test_MSTStringLines () {
	
	it('throws if not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringLines(null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mod._MSTOperations.MSTStringLines(''), []);
	});

	it('excludes if not filled', function () {
		deepEqual(mod._MSTOperations.MSTStringLines('\n'), []);
	});

	it('includes if filled', function () {
		deepEqual(mod._MSTOperations.MSTStringLines('alfa\nbravo\n'), ['alfa', 'bravo']);
	});

});

describe('MSTStringPrepend', function test_MSTStringPrepend () {
	
	it('throws if param1 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringPrepend(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringPrepend('', null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mod._MSTOperations.MSTStringPrepend('', ''), '');
	});

	it('returns prepends param2', function () {
		deepEqual(mod._MSTOperations.MSTStringPrepend('alfa', 'bravo'), 'bravoalfa');
	});

});

describe('MSTStringPostpend', function test_MSTStringPostpend () {
	
	it('throws if param1 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringPostpend(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringPostpend('', null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns string', function () {
		deepEqual(mod._MSTOperations.MSTStringPostpend('', ''), '');
	});

	it('returns postpends param2', function () {
		deepEqual(mod._MSTOperations.MSTStringPostpend('alfa', 'bravo'), 'alfabravo');
	});

});

describe('MSTStringConform', function test_MSTStringConform () {

	it('throws if param1 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringConform(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mod._MSTOperations.MSTStringConform('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns false if no match', function () {
		deepEqual(mod._MSTOperations.MSTStringConform('alfa', /bravo/), false);
	});
	
	it('returns true', function () {
		deepEqual(mod._MSTOperations.MSTStringConform('alfa', /alfa/), true);
	});

});

describe('MSTStringCapture', function test_MSTStringCapture () {

	it('throws if param1 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringCapture(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mod._MSTOperations.MSTStringCapture('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns array', function () {
		deepEqual(mod._MSTOperations.MSTStringCapture('alfa', /bravo/), []);
	});
	
	it('excludes if no capture', function () {
		deepEqual(mod._MSTOperations.MSTStringCapture('alfa', /alfa/), []);
	});
	
	it('includes if capture', function () {
		deepEqual(mod._MSTOperations.MSTStringCapture('alfa', /(alfa)/), [{ 1: 'alfa' }]);
	});

});

describe('MSTStringMarkdown', function test_MSTStringMarkdown () {

	it('throws if param1 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTStringMarkdown(null, function () {});
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not MarkdownParser', function() {
		throws(function() {
			mod._MSTOperations.MSTStringMarkdown('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns MarkdownTree', function () {
		deepEqual(mod._MSTOperations.MSTStringMarkdown('alfa', function () { return {}; }), {
			MSTMarkdownTreeSource: 'alfa',
		});
	});
	
});

describe('MSTArrayFirst', function test_MSTArrayFirst () {

	it('throws if not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayFirst(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns undefined if none', function () {
		deepEqual(mod._MSTOperations.MSTArrayFirst([]), undefined);
	});
	
	it('returns first item', function () {
		deepEqual(mod._MSTOperations.MSTArrayFirst(['alfa', 'bravo']), 'alfa');
	});

});

describe('MSTArrayLast', function test_MSTArrayLast () {

	it('throws if not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayLast(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns undefined if none', function () {
		deepEqual(mod._MSTOperations.MSTArrayLast([]), undefined);
	});
	
	it('returns last item', function () {
		deepEqual(mod._MSTOperations.MSTArrayLast(['alfa', 'bravo']), 'bravo');
	});

});

describe('MSTArray_Access', function test_MSTArrayAccess () {

	it('throws if param1 not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayAccess(null, 1);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns string if not defined', function () {
		deepEqual(mod._MSTOperations.MSTArrayAccess(['alfa', 'bravo'], 2), '');
	});
	
	it('returns element if defined', function () {
		deepEqual(mod._MSTOperations.MSTArrayAccess(['alfa', 'bravo'], 0), 'alfa');
	});

});

describe('MSTArrayReverse', function test_MSTArrayReverse () {

	it('throws if not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayReverse(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns input', function () {
		deepEqual(mod._MSTOperations.MSTArrayReverse([]), []);
	});
	
	it('reverses input', function () {
		deepEqual(mod._MSTOperations.MSTArrayReverse(['alfa', 'bravo']), ['bravo', 'alfa']);
	});

});

describe('MSTArrayUnique', function test_MSTArrayUnique () {

	it('throws if not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayUnique(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns input', function () {
		deepEqual(mod._MSTOperations.MSTArrayUnique([]), []);
	});
	
	it('removes duplicates', function () {
		deepEqual(mod._MSTOperations.MSTArrayUnique(['alfa', 'alfa']), ['alfa']);
	});

});

describe('MSTArrayConform', function test_MSTArrayConform () {

	it('throws if param1 not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayConform(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayConform([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns input', function () {
		deepEqual(mod._MSTOperations.MSTArrayConform([], /alfa/), []);
	});
	
	it('excludes if no match', function () {
		deepEqual(mod._MSTOperations.MSTArrayConform(['alfa'], /bravo/), []);
	});
	
	it('includes', function () {
		deepEqual(mod._MSTOperations.MSTArrayConform(['alfa'], /alfa/), ['alfa']);
	});

});

describe('MSTArrayCapture', function test_MSTArrayCapture () {

	it('throws if param1 not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayCapture(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayCapture([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns input', function () {
		deepEqual(mod._MSTOperations.MSTArrayCapture([], /alfa/), []);
	});
	
	it('excludes if no capture', function () {
		deepEqual(mod._MSTOperations.MSTArrayCapture(['alfa'], /alfa/), []);
	});
	
	it('excludes if no match', function () {
		deepEqual(mod._MSTOperations.MSTArrayCapture(['alfa'], /(bravo)/), []);
	});
	
	it('includes', function () {
		deepEqual(mod._MSTOperations.MSTArrayCapture(['alfa'], /(alfa)/), [{ 1: 'alfa' }]);
	});

});

describe('MSTArrayRemap', function test_MSTArrayRemap () {

	it('throws if param1 not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayRemap(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayRemap([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns array', function () {
		deepEqual(mod._MSTOperations.MSTArrayRemap([], ''), []);
	});
	
	it('parses expression', function () {
		deepEqual(mod._MSTOperations.MSTArrayRemap([{ alfa: 'bravo' }], 'charlie: $alfa'), [{ charlie: 'bravo' }]);
	});

});

describe('MSTArrayPrint', function test_MSTArrayPrint () {

	it('throws if param1 not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayPrint(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayPrint([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns array', function () {
		deepEqual(mod._MSTOperations.MSTArrayPrint([], ''), []);
	});
	
	it('prints expression', function () {
		deepEqual(mod._MSTOperations.MSTArrayPrint([{ alfa: 'bravo' }], 'charlie $alfa'), ['charlie bravo']);
	});

});

describe('MSTArrayJoin', function test_MSTArrayJoin () {

	it('throws if param1 not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayJoin(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayJoin([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns string', function () {
		deepEqual(mod._MSTOperations.MSTArrayJoin([], ''), '');
	});
	
	it('joins items with param2', function () {
		deepEqual(mod._MSTOperations.MSTArrayJoin(['alfa', 'bravo'], ','), 'alfa,bravo');
	});

});

describe('MSTArrayGroup', function test_MSTArrayGroup () {

	it('throws if param1 not array', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayGroup(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTArrayGroup([], null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns Group', function () {
		deepEqual(mod._MSTOperations.MSTArrayGroup([], ''), {
			MSTGroupKey: '',
			MSTGroupValue: {},
		});
	});
	
	it('groups by param2', function () {
		deepEqual(mod._MSTOperations.MSTArrayGroup([{ alfa: 'bravo' }], 'alfa'), {
			MSTGroupKey: 'alfa',
			MSTGroupValue: {
				bravo: [{ alfa: 'bravo' }] },
		});
	});

});

describe('MSTObject_Access', function test_MSTObjectAccess () {

	it('throws if param1 not object', function() {
		throws(function() {
			mod._MSTOperations.MSTObjectRemap(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('returns property access', function () {
		deepEqual(mod._MSTOperations.MSTObjectAccess({ alfa: 'bravo' }, 'alfa'), 'bravo');
	});

});

describe('MSTObjectRemap', function test_MSTObjectRemap () {

	it('throws if param1 not object', function() {
		throws(function() {
			mod._MSTOperations.MSTObjectRemap(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTObjectRemap({}, null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns object', function () {
		deepEqual(mod._MSTOperations.MSTObjectRemap({}, ''), {});
	});
	
	it('parses expression object', function () {
		deepEqual(mod._MSTOperations.MSTObjectRemap({ alfa: 'bravo' }, 'charlie: $alfa'), { charlie: 'bravo' });
	});

});

describe('_MSTObjectRemap', function test_MSTObjectRemap () {

	it('throws if not string', function() {
		throws(function() {
			mod._MSTOperations._MSTObjectRemap(null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns function', function () {
		deepEqual(typeof mod._MSTOperations._MSTObjectRemap(''), 'function');
	});

	context('callback', function () {
		
		it('throws if not object', function () {
			throws(function () {
				mod._MSTOperations._MSTObjectRemap('')(null);
			}, /MSTErrorInputNotValid/);
		});

		it('returns object', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap('')({}), {});
		});

		it('excludes if no key', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap(': $1')({ 1: 2 }), {});
		});

		it('excludes if no sign', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap('alfa: 1')({ 1: 2 }), {});
		});

		it('excludes if no colon', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap('alfa $1')({ 1: 2 }), {});
		});

		it('excludes if multiple colons', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap('alfa: $1: bravo')({ 1: 2 }), {});
		});

		it('excludes if no match', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap('alfa: $0')({ 1: 2 }), {});
		});

		it('includes if match', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap('alfa: $1')({ 1: 2 }), { alfa: 2 });
		});

		it('includes if no whitespace', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap('alfa:$1')({ 1: 2 }), { alfa: 2 });
		});

		it('includes multiple', function () {
			deepEqual(mod._MSTOperations._MSTObjectRemap('alfa: $1, bravo: $3')({ 1: 2, 3: 4 }), { alfa: 2, bravo: 4 });
		});

	});

});

describe('__MSTObjectRemap', function test__MSTObjectRemap () {

	it('throws if param1 not object', function () {
		throws(function () {
			mod._MSTOperations.__MSTObjectRemap(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.__MSTObjectRemap({}, null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns object', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({}, ''), {});
	});

	it('excludes if no key', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({ 1: 2 }, ': $1'), {});
	});

	it('throws if param2 no variable marker', function() {
		throws(function() {
			mod._MSTOperations.__MSTObjectRemap({ 1: 2 }, 'alfa: 1');
		}, /MSTSyntaxErrorNoStartingVariable/);
	});

	it('excludes if no colon', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({ 1: 2 }, 'alfa $1'), {});
	});

	it('throws if multiple colons', function () {
		throws(function () {
			mod._MSTOperations.__MSTObjectRemap({ 1: 2 }, 'alfa: $1: bravo');
		}, /MSTSyntaxErrorNoIdentifier/);
	});

	it('excludes if no match', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({ 1: 2 }, 'alfa: $0'), {});
	});

	it('includes if match', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({ 1: 2 }, 'alfa: $1'), { alfa: 2 });
	});

	it('includes if no whitespace', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({ 1: 2 }, 'alfa:$1'), { alfa: 2 });
	});

	it('includes multiple', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({ 1: 2, 3: 4 }, 'alfa: $1, bravo: $3'), { alfa: 2, bravo: 4 });
	});

	it('prints expression', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({ 1: 2 }, 'alfa: $1.prepend(bravo)'), { alfa: 'bravo2' });
	});

	it('parses subexpressions', function () {
		deepEqual(mod._MSTOperations.__MSTObjectRemap({ 1: 2, 3: 4, 5: 6, 7: 8 }, 'alfa: $1.postpend( $3:$5), bravo: $7'), { alfa: '2 4:6', bravo: '8' });
	});
	
});

describe('MSTObjectPrint', function test_MSTObjectPrint () {

	it('throws if param1 not object', function() {
		throws(function() {
			mod._MSTOperations.MSTObjectPrint(null, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTObjectPrint({}, null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns param2', function () {
		deepEqual(mod._MSTOperations.MSTObjectPrint({}, 'alfa'), 'alfa');
	});
	
	it('substitutes variable', function () {
		deepEqual(mod._MSTOperations.MSTObjectPrint({ alfa: 'bravo' }, 'charlie $alfa'), 'charlie bravo');
	});
	
	it('prints subexpression', function () {
		deepEqual(mod._MSTOperations.MSTObjectPrint({ alfa: 'bravo' }, 'charlie $alfa.prepend(delta)'), 'charlie deltabravo');
	});

});

const uParser = require('unified')().use(require('remark-parse')).parse;

const uTree = function (inputData) {
	return mod._MSTOperations.MSTStringMarkdown(inputData, uParser);
};

describe('MSTMarkdownSections', function test_MSTMarkdownSections () {

	const uSources = function (inputData) {
		return mod._MSTOperations.MSTMarkdownSections(uTree(inputData)).map(function (e) {
			return e.MSTMarkdownTreeSource;
		});
	};

	it('throws if not MarkdownTree', function() {
		throws(function() {
			mod._MSTOperations.MSTMarkdownSections({});
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

describe('MSTMarkdownContent', function test_MSTMarkdownSection () {

	const uSource = function (param1, param2) {
		return mod._MSTOperations.MSTMarkdownContent(uTree(param1), param2);
	};

	it('throws if param1 not MarkdownTree', function() {
		throws(function() {
			mod._MSTOperations.MSTMarkdownContent({}, '');
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mod._MSTOperations.MSTMarkdownContent(uTree(''), null);
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

describe('MSTMarkdownItems', function test_MSTMarkdownItems () {

	it('throws if not MarkdownTree', function() {
		throws(function() {
			mod._MSTOperations.MSTMarkdownItems({});
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mod._MSTOperations.MSTMarkdownItems(uTree('')), []);
	});

	it('excludes non bullets', function () {
		deepEqual(mod._MSTOperations.MSTMarkdownItems(uTree('alfa')), []);
	});

	it('includes hyphenated', function () {
		deepEqual(mod._MSTOperations.MSTMarkdownItems(uTree('- alfa\n- bravo')), ['alfa', 'bravo']);
	});

	it('includes starred', function () {
		deepEqual(mod._MSTOperations.MSTMarkdownItems(uTree('* alfa\n* bravo')), ['alfa', 'bravo']);
	});
	
});

describe('MSTMarkdownParagraphs', function test_MSTMarkdownParagraphs () {

	it('throws if not MarkdownTree', function() {
		throws(function() {
			mod._MSTOperations.MSTMarkdownParagraphs({});
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mod._MSTOperations.MSTMarkdownParagraphs(uTree('')), []);
	});

	it('includes single line', function () {
		deepEqual(mod._MSTOperations.MSTMarkdownParagraphs(uTree('alfa')), ['alfa']);
	});

	it('includes multiple line', function () {
		deepEqual(mod._MSTOperations.MSTMarkdownParagraphs(uTree('alfa\nbravo')), ['alfa\nbravo']);
	});

	it('includes multiple paragraphs', function () {
		deepEqual(mod._MSTOperations.MSTMarkdownParagraphs(uTree('alfa\nbravo\n\ncharlie\ndelta')), ['alfa\nbravo', 'charlie\ndelta']);
	});
	
});
