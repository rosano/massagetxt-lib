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

		it('index', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines[1]'), 'bravo');
		});

		it('match bool', function () {
			deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.isMatch(/alfa/)'), JSON.stringify(['alfa']));
		});
	
	});

});
