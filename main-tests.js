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

describe('MSTMassageOperations', function testMSTMassageOperations() {

	it('throws if not string', function() {
		throws(function() {
			mainModule.MSTMassageOperations(null);
		}, /MSTErrorInputNotValid/);
	});

	it('returns array', function () {
		deepEqual(mainModule.MSTMassageOperations(''), []);
	});

	context('root', function () {

		const item = mainModule.MSTMassageOperations('root').shift();
		
		it('returns object', function () {
			deepEqual(typeof item, 'object');
		});
	
	});

	context('lines', function () {

		const item = mainModule.MSTMassageOperations('lines').shift();
		
		it('returns object', function () {
			deepEqual(typeof item, 'object');
		});

		it('sets MSTOperationInputType', function () {
			deepEqual(item.MSTOperationInputType, 'String');
		});

		it('sets MSTOperationCallback', function () {
			deepEqual(item.MSTOperationCallback, mainModule._MSTOperations.MSTStringOperationLines);
		});
	
	});

	context('last', function () {

		const item = mainModule.MSTMassageOperations('last').shift();
		
		it('returns object', function () {
			deepEqual(typeof item, 'object');
		});

		it('sets MSTOperationInputType', function () {
			deepEqual(item.MSTOperationInputType, 'Array');
		});

		it('sets MSTOperationCallback', function () {
			deepEqual(item.MSTOperationCallback, mainModule._MSTOperations.MSTArrayOperationLast);
		});
	
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

describe('MSTArrayOperationLast', function testMSTArrayOperationLast () {
	
	it('returns undefined if none', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayOperationLast([]), undefined);
	});
	
	it('returns last item', function () {
		deepEqual(mainModule._MSTOperations.MSTArrayOperationLast(['alfa', 'bravo']), 'bravo');
	});

});
