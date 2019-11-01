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

});
