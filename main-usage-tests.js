import { throws, deepEqual } from 'assert';

import { MSTMassage } from './main.js';

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

		it('match bool false', function () {
			deepEqual(MSTMassage('alfa', '$input.isMatch(/bravo/)'), 'false');
		});

		it('match bool true', function () {
			deepEqual(MSTMassage('alfa', '$input.isMatch(/alfa/)'), 'true');
		});

		it('match with no capture', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.match(/- .*\n/)'), '[]');
		});

		it('match with capture with no global', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.match(/- (.*)\n/)'), JSON.stringify([{ 1: 'alfa' }]));
		});

		it('match with capture with global', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.match(/- (.*)\n/g)'), JSON.stringify([{ 1: 'alfa' }, { 1: 'bravo' }]));
		});

		it('match with capture no match', function () {
			deepEqual(MSTMassage('-alfa\n- bravo\n', '$input.match(/- (.*)\n/)'), JSON.stringify([{ 1: 'bravo' }]));
		});

		it('lines', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines'), JSON.stringify(['alfa', 'bravo']));
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
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.match(/(\\w+)/).remap(name: $1).group(name)'), JSON.stringify({alfa: [{ name: 'alfa' }], bravo: [{ name: 'bravo' }]}));
		});

		it('index', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines[1]'), 'bravo');
		});

		it('match bool', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.isMatch(/alfa/)'), JSON.stringify(['alfa']));
		});

		it('match with no capture', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.lines.match(/- .*/)'), '[]');
		});

		it('match with capture with no global', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.lines.match(/- (.*)/)'), JSON.stringify([{ 1: 'alfa' }, { 1: 'bravo' }]));
		});

		it.skip('match with capture with global', function () {
			deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.lines.match(/- (.*)/g)'), JSON.stringify([{ 1: 'alfa' }, { 1: 'bravo' }]));
		});

		it('match with capture no match', function () {
			deepEqual(MSTMassage('-alfa\n- bravo\n', '$input.lines.match(/- (.*)/)'), JSON.stringify([{ 1: 'bravo' }]));
		});

		it('remap', function () {
			deepEqual(MSTMassage('- alfa 1\n- bravo 2\n', '$input.lines.match(/- (\\w+) (\\d+)/).remap(name: $1, number: $2)'), JSON.stringify([{ name: 'alfa', number: '1'}, { name: 'bravo', number: '2' }]));
		});

		it('print', function () {
			deepEqual(MSTMassage('- alfa 1\n- bravo 2\n', '$input.lines.match(/- (\\w+) (\\d+)/).remap(name: $1, number: $2).print(- $name $number)'), JSON.stringify(['- alfa 1', '- bravo 2']));
		});

		it('join', function () {
			deepEqual(MSTMassage('- alfa 1\n- bravo 2\n', '$input.lines.join(,)'), '- alfa 1,- bravo 2');
		});
	
	});

	context('object', function () {

		it('remap', function () {
			deepEqual(MSTMassage('- alfa 1', '$input.match(/- (\\w+) (\\d+)/).first.remap(name: $1, number: $2)'), JSON.stringify({ name: 'alfa', number: '1'}));
		});

		it('print', function () {
			deepEqual(MSTMassage('- alfa 1', '$input.match(/- (\\w+) (\\d+)/).first.remap(name: $1, number: $2).print(- $name $number)'), '- alfa 1');
		});
	
	});

	context('group', function () {

		it('print', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.match(/(\\w+)/).remap(name: $1).group(name).print(charlie $name)'), JSON.stringify({ alfa: ['charlie alfa'], bravo: ['charlie bravo'] }));
		});

		it('join', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.match(/(\\w+)/).remap(name: $1).group(name).print(charlie $name).join(,)'), JSON.stringify({ alfa: 'charlie alfa', bravo: 'charlie bravo' }));
		});
	
	});

	context('case', function () {

		it('structure', function () {
			deepEqual(MSTMassage('- 2019.11.05 alfa: bravo\n- 2018.11.05 charlie: delta\n', '$input.lines.match(/- (\\d+)\\.\\d+\\.\\d+ (.*): (.*)/).remap(echo: $1, foxtrot: $2, golf: $3)'), JSON.stringify([{ echo: '2019', foxtrot: 'alfa', golf: 'bravo' }, { echo: '2018', foxtrot: 'charlie', golf: 'delta' }]));
		});
	
	});

});
