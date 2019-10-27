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
			deepEqual(typeof item, 'object')
		});
	
	});

	context('lines', function () {

		const item = mainModule.MSTMassageOperations('lines').shift();
		
		it('returns object', function () {
			deepEqual(typeof item, 'object')
		});

		it('sets MSTOperationInputType', function () {
			deepEqual(item.MSTOperationInputType, 'String');
		});

		context('MSTOperationCallback', function () {
			
			it('returns array', function () {
				deepEqual(item.MSTOperationCallback('alfa\nbravo'), ['alfa', 'bravo'])
			});
		
		});
	
	});

	context('last', function () {

		const item = mainModule.MSTMassageOperations('last').shift();
		
		it('returns object', function () {
			deepEqual(typeof item, 'object')
		});

		it('sets MSTOperationInputType', function () {
			deepEqual(item.MSTOperationInputType, 'Array');
		});

		context('MSTOperationCallback', function () {
			
			it('returns array', function () {
				deepEqual(item.MSTOperationCallback(['alfa', 'bravo']), 'bravo')
			});
		
		});
	
	});

});