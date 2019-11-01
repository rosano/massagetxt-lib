export const MSTMassage = function (param1, param2) {
	if (typeof param1 !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	if (typeof param2 !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	return MSTMassageOperations(param2).reduce(function (coll, item) {
		return item.MSTOperationCallback(coll);
	}, param1);
};

export const MSTMassageOperations = function (inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	if (!inputData) {
		return [];
	}

	return inputData.split('.').map(function (e) {
		if (e === 'last') {
			return {
				MSTOperationInputType: 'Array',
				MSTOperationCallback: _MSTOperations.MSTArrayLast,
			};
		}

		if (e === 'lines') {
			return {
				MSTOperationInputType: 'String',
				MSTOperationCallback: _MSTOperations.MSTStringOperationLines,
			};
		}

		return {
			MSTOperationCallback (inputData) {
				return inputData;
			},
		};
	});
};

export const _MSTOperations = {
	
	MSTArrayLast (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('MSTErrorInputNotValid');
		}

		return inputData.slice(-1).pop();
	},
	
	MSTStringOperationLines (inputData) {
		return inputData.split('\n');
	},
	
	MSTStringIsMatch (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		if (!(param2 instanceof RegExp)) {
			throw new Error('MSTErrorInputNotValid');
		};

		return !!param1.match(param2);
	},
	
	MSTStringMap (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		if (!(param2 instanceof RegExp)) {
			throw new Error('MSTErrorInputNotValid');
		};

		const match = param1.match(param2);

		if (!match) {
			return {};
		};

		return match.reduce(function (coll, item, index) {
			if (index) {
				coll[index] = item;
			};

			return coll;
		}, {});
	},

};
