export const MSTMassage = function (param1, param2) {
	if (typeof param1 !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	if (typeof param2 !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	return _MSTMassageTerminate(_MSTMassageOperations(param2).reduce(function (coll, item) {
		return (item.MSTOperationCallbackIndirect || item.MSTOperationCallback)(coll);
	}, param1));
};

export const _MSTMassageOperations = function (inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	if (!inputData) {
		return [];
	}

	return inputData.split('.').map(function (e) {
		let match;

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

		if (match = e.match(/isMatch\(\/(.+)\/(\w)?\)/)) {
			return new function() {
				const self = this;

				Object.assign(this, {
					MSTOperationInputType: 'String,Regex',
					MSTOperationCallbackIndirect (inputData) {
						return self.MSTOperationCallback(inputData, new RegExp(match[1], match[2]));
					},
					MSTOperationCallback: _MSTOperations.MSTStringIsMatch,
				});
			};
		}

		return {
			MSTOperationCallback: _MSTOperations._MSTBypass,
		};
	});
};

export const _MSTMassageTerminate = function (inputData) {
	return __MSTMassageTerminateFunction(inputData)(inputData);
};

export const __MSTMassageTerminateFunction = function (inputData) {
	if (typeof inputData !== 'string') {
		return JSON.stringify;
	}

	return _MSTOperations._MSTBypass;
};

export const _MSTOperations = {
	
	_MSTBypass (inputData) {
		return inputData;
	},
	
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
