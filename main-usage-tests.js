import { throws, deepEqual } from 'assert';

import { MSTMassage } from './main.js';

describe('MSTMassage_Usage', function testMSTMassage_Usage() {

	it('param1 empty', function () {
		deepEqual(MSTMassage('', 'root'), '');
	});

	it('param2 empty', function () {
		deepEqual(MSTMassage('alfa', ''), 'alfa');
	});

	it('root', function () {
		deepEqual(MSTMassage('alfa', 'root'), 'alfa');
	});

	it('root.raw', function () {
		deepEqual(MSTMassage('alfa', 'root.raw'), 'alfa');
	});

	it('string match bool false', function () {
		deepEqual(MSTMassage('alfa', 'root.raw.isMatch(/bravo/)'), 'false');
	});

	it('string match bool true', function () {
		deepEqual(MSTMassage('alfa', 'root.raw.isMatch(/alfa/)'), 'true');
	});

	it('string match array with no capture', function () {
		deepEqual(MSTMassage('- alfa\n- bravo\n', 'root.raw.matchArray(/- .*\n/)'), '[]');
	});

	it('string match array with capture with no global', function () {
		deepEqual(MSTMassage('- alfa\n- bravo\n', 'root.raw.matchArray(/- (.*)\n/)'), JSON.stringify([{ 1: 'alfa' }]));
	});

	it('string match array with capture with global', function () {
		deepEqual(MSTMassage('- alfa\n- bravo\n', 'root.raw.matchArray(/- (.*)\n/g)'), JSON.stringify([{ 1: 'alfa' }, { 1: 'bravo' }]));
	});

	it('root.lines', function () {
		deepEqual(MSTMassage('alfa\nbravo\n', 'root.lines'), JSON.stringify(['alfa', 'bravo']));
	});

});
