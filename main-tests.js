import { throws, deepEqual } from 'assert';

import * as mainModule from './main.js';

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
		deepEqual(mainModule.MSTMassage('alfa\nbravo', 'root.lines.last'), 'bravo');
	});

});

describe('_MSTMassageOperations', function test_MSTMassageOperations() {

	it('throws if not string', function() {
		throws(function() {
			mainModule._MSTMassageOperations(null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mainModule._MSTMassageOperations(''), []);
	});

	context('root', function () {

		const item = mainModule._MSTMassageOperations('root').shift();
		
		it('returns object', function () {
			deepEqual(typeof item, 'object');
		});
	
	});

	context('lines', function () {

		const item = mainModule._MSTMassageOperations('lines').shift();
		
		it('sets MSTOperationInputType', function () {
			deepEqual(item.MSTOperationInputType, 'String');
		});

		it('sets MSTOperationCallback', function () {
			deepEqual(item.MSTOperationCallback, mainModule._MSTOperations.MSTStringOperationLines);
		});
	
	});

	context('last', function () {

		const item = mainModule._MSTMassageOperations('last').shift();
		
		it('sets MSTOperationInputType', function () {
			deepEqual(item.MSTOperationInputType, 'Array');
		});

		it('sets MSTOperationCallback', function () {
			deepEqual(item.MSTOperationCallback, mainModule._MSTOperations.MSTArrayLast);
		});
	
	});

	context('isMatch(…)', function () {

		const item = mainModule._MSTMassageOperations('isMatch(/alfa/)').shift();
		
		it('sets MSTOperationInputType', function () {
			deepEqual(item.MSTOperationInputType, 'String,Regex');
		});

		it('sets MSTOperationCallback', function () {
			deepEqual(item.MSTOperationCallback, mainModule._MSTOperations.MSTStringIsMatch);
		});

		context('MSTOperationCallbackIndirect', function () {

			it('passes inputs', function () {
				deepEqual(item.MSTOperationCallbackIndirect('alfa'), true)
			});
		
		});
	
	});

});

describe('_MSTMassageTerminate', function test_MSTMassageTerminate() {

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

describe('MSTStringOperationLines', function testMSTStringOperationLines () {
	
	it('returns single if none', function () {
		deepEqual(mainModule._MSTOperations.MSTStringOperationLines(''), ['']);
	});

	it('returns multiple if newline', function () {
		deepEqual(mainModule._MSTOperations.MSTStringOperationLines('alfa\nbravo'), ['alfa', 'bravo']);
	});

});

describe('_MSTBypass', function test_MSTBypass () {

	it('returns input', function () {
		let item = function () {};
		deepEqual(mainModule._MSTOperations._MSTBypass(item), item);
	});

});

describe('MSTStringIsMatch', function testMSTStringIsMatch () {

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringIsMatch(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringIsMatch('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns object', function () {
		deepEqual(mainModule._MSTOperations.MSTStringIsMatch('alfa', /bravo/), false);
	});
	
	it('sets index', function () {
		deepEqual(mainModule._MSTOperations.MSTStringIsMatch('alfa', /alfa/), true);
	});

});

describe('MSTStringMap', function testMSTStringMap () {

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringMap(null, /alfa/);
		}, /MSTErrorInputNotValid/);
	});

	it('throws if param2 not RegExp', function() {
		throws(function() {
			mainModule._MSTOperations.MSTStringMap('', null);
		}, /MSTErrorInputNotValid/);
	});
	
	it('returns object', function () {
		deepEqual(mainModule._MSTOperations.MSTStringMap('alfa', /(bravo|charlie)/), {});
	});
	
	it('sets index', function () {
		deepEqual(mainModule._MSTOperations.MSTStringMap('alfa bravo', /(\w+) \w+/), {
			1: 'alfa',
		});
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
