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

	it('$input', function () {
		deepEqual(MSTMassage('alfa', '$input'), 'alfa');
	});

	it('string match bool false', function () {
		deepEqual(MSTMassage('alfa', '$input.isMatch(/bravo/)'), 'false');
	});

	it('string match bool true', function () {
		deepEqual(MSTMassage('alfa', '$input.isMatch(/alfa/)'), 'true');
	});

	it('string match array with no capture', function () {
		deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.matchArray(/- .*\n/)'), '[]');
	});

	it('string match array with capture with no global', function () {
		deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.matchArray(/- (.*)\n/)'), JSON.stringify([{ 1: 'alfa' }]));
	});

	it('string match array with capture with global', function () {
		deepEqual(MSTMassage('- alfa\n- bravo\n', '$input.matchArray(/- (.*)\n/g)'), JSON.stringify([{ 1: 'alfa' }, { 1: 'bravo' }]));
	});

	it('$input.lines', function () {
		deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines'), JSON.stringify(['alfa', 'bravo']));
	});

	it('$input.lines.first', function () {
		deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.first'), 'alfa');
	});

	it('$input.lines.last', function () {
		deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines.last'), 'bravo');
	});

	it('$input.lines[1]', function () {
		deepEqual(MSTMassage('alfa\nbravo\n', '$input.lines[1]'), 'bravo');
	});

});
