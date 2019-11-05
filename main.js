export const MSTMassage = function (param1, param2) {
	if (typeof param1 !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	if (typeof param2 !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	return _MSTMassageTerminate(_MSTMassageOperations(param2).reduce(function (coll, item) {
		return item(coll);
	}, param1));
};

export const _MSTMassageOperations = function (inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	if (!inputData) {
		return [];
	}

	return [].concat.apply([], [inputData.split('.')[0]].concat((inputData.match(/\.(\w+)(\([^]+\))?(\[[^]+\])?/g) || []).map(function (e) {
		const match = e.match(/(\[[^]+\])?$/);
		return [e.slice(0, match.index).split('.').slice(1).join('.')].concat(match[0] || []);
	}))).map(function (operationString) {
		const operations = __MSTMassageOperations().filter(function (e) {
			return operationString.match(e.MSTOperationPattern);
		});

		if (!operations.length) {
			throw new Error('MSTErrorIdentifierNotValid');
		};

		return function (inputData) {
			return operations.filter(function (e) {
				if (!e.MSTOperationInputTypes) {
					return true;
				};

				return _MSTMassageInputTypes(e.MSTOperationInputTypes).shift() === _MSTMassageTypeForInput(inputData);
			}).slice(0, 1).map(function (e) {
				const match = operationString.match(e.MSTOperationPattern);

				if (_MSTMassageInputTypes(e.MSTOperationInputTypes || '').pop() === 'Regex') {
					const callback = e.MSTOperationCallback;

					e.MSTOperationCallback = function (inputData) {
						return callback(inputData, new RegExp(match[1], match[2]));
					};
				} else if (typeof match.index !== 'undefined') {
					const callback = e.MSTOperationCallback;
					
					e.MSTOperationCallback = function (inputData) {
						return callback(inputData, match[1]);
					};
				};

				return e.MSTOperationCallback(inputData);
			}).shift();
		};
	});
};

export const _MSTMassageInputTypes = function(inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	return inputData.split(',').map(function (e) {
		return e.trim();
	}).filter(function (e) {
		return !!e;
	});
};

export const _MSTMassageTypeForInput = function(inputData) {
	if (typeof inputData === 'string') {
		return 'String';
	}

	if (Array.isArray(inputData)) {
		return 'Array';
	};

	if (typeof inputData === 'object' && inputData !== null) {
		return 'Object';
	};

	throw new Error('MSTErrorInputNotValid');
};

export const __MSTMassageOperations = function () {
	return [{
		MSTOperationPattern: /^\$?input$/,
		MSTOperationCallback: _MSTOperations._MSTBypass
	}, {
		MSTOperationPattern: /^lines$/,
		MSTOperationInputTypes: 'String',
		MSTOperationCallback: _MSTOperations.MSTStringLines
	}, {
		MSTOperationPattern: /^isMatch\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'String,Regex',
		MSTOperationCallback: _MSTOperations.MSTStringIsMatch,
	}, {
		MSTOperationPattern: /^match\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'String,Regex',
		MSTOperationCallback: _MSTOperations.MSTStringMatch,
	}, {
		MSTOperationPattern: /^first$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: _MSTOperations.MSTArrayFirst,
	}, {
		MSTOperationPattern: /^last$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: _MSTOperations.MSTArrayLast,
	}, {
		MSTOperationPattern: /^\[([^]+)\]$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: _MSTOperations.MSTArrayAccess,
	}, {
		MSTOperationPattern: /^reverse$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: _MSTOperations.MSTArrayReverse,
	}, {
		MSTOperationPattern: /^unique$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: _MSTOperations.MSTArrayUnique,
	}, {
		MSTOperationPattern: /^isMatch\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'Array,Regex',
		MSTOperationCallback: _MSTOperations.MSTArrayIsMatch,
	}, {
		MSTOperationPattern: /^match\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'Array,Regex',
		MSTOperationCallback: _MSTOperations.MSTArrayMatch,
	}];
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
	
	MSTStringLines (inputData) {
		return inputData.split('\n').filter(function (e) {
			return e.length;
		});
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
	
	MSTStringMatch (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		if (!(param2 instanceof RegExp)) {
			throw new Error('MSTErrorInputNotValid');
		};

		const match = param1.match(param2);

		if (!match) {
			return [];
		};

		if (match.length <= 1) {
			return [];
		};

		return (typeof match.index !== 'undefined' ? [match] : match.map(function (e) {
			return param2.exec(e.match(param2)); // #mysterious result is null unless match is called
		})).map(function (e) {
			return e.reduce(function (coll, item, index) {
				if (index) {
					coll[index] = item;
				};

				return coll;
			}, {})
		});
	},
	
	MSTArrayFirst (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('MSTErrorInputNotValid');
		}

		return inputData[0];
	},
	
	MSTArrayLast (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('MSTErrorInputNotValid');
		}

		return inputData.slice(-1).pop();
	},
	
	MSTArrayAccess (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('MSTErrorInputNotValid');
		}

		return param1[param2];
	},
	
	MSTArrayReverse (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('MSTErrorInputNotValid');
		}

		return inputData.reverse();
	},
	
	MSTArrayUnique (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('MSTErrorInputNotValid');
		}

		return Array.from(new Set(inputData));
	},
	
	MSTArrayIsMatch (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (!(param2 instanceof RegExp)) {
			throw new Error('MSTErrorInputNotValid');
		};

		return param1.filter(function (e) {
			return e.match(param2);
		});
	},
	
	MSTArrayMatch (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (!(param2 instanceof RegExp)) {
			throw new Error('MSTErrorInputNotValid');
		};

		return param1.map(function (e) {
			return _MSTOperations.MSTStringMatch(e, param2).shift();
		}).filter(function (e) {
			return e;
		});
	},
	
	MSTObjectRemap (param1, param2) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		};

		return _MSTOperations._MSTObjectRemap(param2)(param1);
	},
	
	_MSTObjectRemap (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		};

		return function (object) {
			if (typeof object !== 'object' || object === null) {
				throw new Error('MSTErrorInputNotValid');
			}

			return inputData.split(',').map(function (e) {
				const pair = e.split(':').map(function (e) {
					return e.trim();
				});

				if (pair.length != 2) {
					return null;
				};

				if (!pair[0]) {
					return null;
				};

				if (pair[1][0] !== '$') {
					return null;
				};

				if (!Object.keys(object).includes(pair[1].slice(1))) {
					return null;
				};

				return pair;
			}).filter(function (e) {
				return e;
			}).reduce(function (coll, [key, value]) {
				coll[key] = object[value.slice(1)];

				return coll;
			}, {});
		};
	},

};
