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
	};

	return inputData.split('.').map(function (e) {
		if (e === 'last') {
			return {
				MSTOperationInputType: 'Array',
				MSTOperationCallback (inputData) {
					return inputData.slice(-1).pop();
				},
			}
		};

		if (e === 'lines') {
			return {
				MSTOperationInputType: 'String',
				MSTOperationCallback (inputData) {
					return inputData.split('\n');
				},
			}
		};

		return {
			MSTOperationCallback (inputData) {
				return inputData;
			},
		};
	});
};
