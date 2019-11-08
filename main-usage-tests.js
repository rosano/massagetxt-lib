const { throws, deepEqual } = require('assert');

const { MSTMassage } = require('./main.js');

describe('MSTMassage_Usage', function testMSTMassage_Usage() {

	it('param1 empty', function () {
		deepEqual(MSTMassage('', '$input'), '');
	});

	it('param2 empty', function () {
		deepEqual(MSTMassage('alfa', ''), 'alfa');
	});

	it('$input', function () {
		deepEqual(MSTMassage('alfa', '$input'), 'alfa');
	});

	context('string', function () {

		it('conform false', function () {
			deepEqual(MSTMassage('alfa', '$input.conform(/bravo/)'), 'false');
		});

		it('conform true', function () {
			deepEqual(MSTMassage('alfa', '$input.conform(/alfa/)'), 'true');
		});

		it('capture with no group', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.capture(/- .*\n/)'), '[]');
		});

		it('capture with group with no global', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.capture(/- (.*)\n/)'), JSON.stringify([{ 1: 'alfa' }]));
		});

		it('capture with group with global', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.capture(/- (.*)\n/g)'), JSON.stringify([{ 1: 'alfa' }, { 1: 'bravo' }]));
		});

		it('capture with group no match', function () {
			deepEqual(MSTMassage('-alfa\n- bravo\n', '$input.capture(/- (.*)\n/)'), JSON.stringify([{ 1: 'bravo' }]));
		});

		it('lines', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines'), JSON.stringify(['alfa', 'bravo']));
		});

		it('prepend', function () {
			deepEqual(MSTMassage('alfa', '$input.prepend(bravo)'), 'bravoalfa');
		});

		it('postpend', function () {
			deepEqual(MSTMassage('alfa', '$input.postpend(bravo)'), 'alfabravo');
		});
	
	});

	context('array', function () {

		it('first', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.first'), 'alfa');
		});

		it('last', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.last'), 'bravo');
		});

		it('reverse', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.reverse'), JSON.stringify(['bravo', 'alfa']));
		});

		it('unique', function () {
			deepEqual(MSTMassage('alfa\nalfa\n', '$input.lines.unique'), JSON.stringify(['alfa']));
		});

		it('group', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.capture(/(\\w+)/).remap(name: $1).group(name)'), JSON.stringify({alfa: [{ name: 'alfa' }], bravo: [{ name: 'bravo' }]}));
		});

		it('access not defined', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines[2]'), '');
		});

		it('access', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines[1]'), 'bravo');
		});

		it('conform', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.conform(/alfa/)'), JSON.stringify(['alfa']));
		});

		it('capture with no group', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.lines.capture(/- .*/)'), '[]');
		});

		it('capture with group with no global', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.lines.capture(/- (.*)/)'), JSON.stringify([{ 1: 'alfa' }, { 1: 'bravo' }]));
		});

		it.skip('capture with group with global', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.lines.capture(/- (.*)/g)'), JSON.stringify([{ 1: 'alfa' }, { 1: 'bravo' }]));
		});

		it('capture with group no match', function () {
			deepEqual(MSTMassage('-alfa\n- bravo\n', '$input.lines.capture(/- (.*)/)'), JSON.stringify([{ 1: 'bravo' }]));
		});

		it('remap', function () {
			deepEqual(MSTMassage('- alfa 1\n- bravo 2\n', '$input.lines.capture(/- (\\w+) (\\d+)/).remap(name: $1, number: $2)'), JSON.stringify([{ name: 'alfa', number: '1'}, { name: 'bravo', number: '2' }]));
		});

		it('print', function () {
			deepEqual(MSTMassage('- alfa 1\n- bravo 2\n', '$input.lines.capture(/- (\\w+) (\\d+)/).remap(name: $1, number: $2).print(- $name $number)'), JSON.stringify(['- alfa 1', '- bravo 2']));
		});

		it('join', function () {
			deepEqual(MSTMassage('- alfa 1\n- bravo 2\n', '$input.lines.join(,)'), '- alfa 1,- bravo 2');
		});
	
	});

	context('object', function () {

		it('remap', function () {
			deepEqual(MSTMassage('- alfa 1', '$input.capture(/- (\\w+) (\\d+)/).first.remap(name: $1, number: $2)'), JSON.stringify({ name: 'alfa', number: '1'}));
		});

		it('access', function () {
			deepEqual(MSTMassage('- alfa 1', '$input.capture(/- (\\w+) (\\d+)/).first.remap(name: $1, number: $2)[name]'), 'alfa');
		});

		it('print', function () {
			deepEqual(MSTMassage('- alfa 1', '$input.capture(/- (\\w+) (\\d+)/).first.remap(name: $1, number: $2).print(- $name $number)'), '- alfa 1');
		});
	
	});

	context('group', function () {

		it('print', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.capture(/(\\w+)/).remap(name: $1).group(name).print(charlie $name)'), JSON.stringify({ alfa: ['charlie alfa'], bravo: ['charlie bravo'] }));
		});

		it('join 1', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.capture(/(\\w+)/).remap(name: $1).group(name).print(charlie $name).join(,)'), JSON.stringify({ alfa: 'charlie alfa', bravo: 'charlie bravo' }));
		});

		it('join 2', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.capture(/(\\w+)/).remap(name: $1).group(name).print(charlie $name).join(,).join(,)'), 'charlie alfa,charlie bravo');
		});

		it('prepend 1', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.capture(/(\\w+)/).remap(name: $1, other: $1).group(name).print(charlie $other).prepend(delta $name ).join(,).join(,)'), 'delta alfa charlie alfa,delta bravo charlie bravo');
		});
	
	});

	context('case', function () {

		it('structure', function () {
			deepEqual(MSTMassage('- 2019.11.05 alfa: bravo\n- 2018.11.05 charlie: delta\n', '$input.lines.capture(/- (\\d+)\\.\\d+\\.\\d+ (.*): (.*)/).remap(echo: $1, foxtrot: $2, golf: $3)'), JSON.stringify([{ echo: '2019', foxtrot: 'alfa', golf: 'bravo' }, { echo: '2018', foxtrot: 'charlie', golf: 'delta' }]));
		});

		it('re-structure', function () {
			deepEqual(MSTMassage('- 2019.11.05 alfa: bravo\n- 2018.11.05 charlie: delta\n', '$input.lines.capture(/- (\\d+)\\.\\d+\\.\\d+ (.*): (.*)/).remap(echo: $1, foxtrot: $2, golf: $3).group(echo).print(  $foxtrot : $golf).join(\n).prepend(HOTEL $echo\n).join(\n\n)'), 'HOTEL 2018\n  charlie : delta\n\nHOTEL 2019\n  alfa : bravo');
		});
	
	});

});

describe('MSTMassage_Markdown', function testMSTMassage_Markdown() {
	
	const uParser = require('unified')().use(require('remark-parse')).parse;

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

	it('sections with no heading', function () {
		deepEqual(MSTMassage('alfa', '$input.markdown.sections', uOptions()), JSON.stringify(['alfa']));
	});

	it('sections with heading', function () {
		deepEqual(MSTMassage('# alfa', '$input.markdown.sections', uOptions()), JSON.stringify(['# alfa']));
	});

	it('sections with heading first not empty', function () {
		deepEqual(MSTMassage('alfa\n\n# bravo\ncharlie', '$input.markdown.sections', uOptions()), JSON.stringify(['alfa', '# bravo\ncharlie']));
	});

	it('sections array access', function () {
		deepEqual(MSTMassage('alfa', '$input.markdown.sections[0]', uOptions()), 'alfa');
	});

	it('section not defined', function () {
		deepEqual(MSTMassage('alfa\nbravo', '$input.markdown.section(alfa)', uOptions()), '');
	});

	it('section defined', function () {
		deepEqual(MSTMassage('# alfa\nbravo', '$input.markdown.section(alfa)', uOptions()), 'bravo');
	});

	it('section nested direct', function () {
		deepEqual(MSTMassage('# alfa\n## bravo\ncharlie\n# delta\n## bravo\necho', '$input.markdown.section(bravo)', uOptions()), 'charlie');
	});

	it.skip('section nested', function () {
		deepEqual(MSTMassage('# alfa\n## bravo\ncharlie\n# delta\n## bravo\necho', '$input.markdown.section(delta).section(bravo)', uOptions()), 'echo');
	});

	it('items', function () {
		deepEqual(MSTMassage('- alfa\n- bravo', '$input.markdown.items', uOptions()), JSON.stringify(['alfa', 'bravo']));
	});

});
