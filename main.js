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

	return [].concat.apply([], [inputData.split('.')[0]].concat((inputData.split('').reverse().join('').match(/(\][^]+?\[)?(\)[^]+?\()?(\w+)\./g) || []).map(function (e) {
		e = e.split('').reverse().join('');

		const match = e.match(/(\[[^]+\])?$/);

		return [e.slice(0, match.index).split('.').slice(1).join('.')].concat(match[0] || []);
	}).reverse())).map(function (operationString) {
		const operations = __MSTMassageOperations().filter(function (e) {
			return operationString.match(e.MSTOperationPattern);
		});

		if (!operations.length) {
			throw new Error('MSTErrorIdentifierNotValid');
		};

		const callback = function (inputData) {
			const operation = operations.filter(function (e) {
				if (!e.MSTOperationInputTypes) {
					return true;
				};

				return _MSTMassageInputTypes(e.MSTOperationInputTypes).shift() === _MSTMassageType(inputData);
			}).shift();

			if (!operation) {
				throw new Error('MSTErrorIdentifierNotValid');
			};

			const match = operationString.match(operation.MSTOperationPattern);

			if (_MSTMassageInputTypes(operation.MSTOperationInputTypes || '').pop() === 'Regex') {
				const callback = operation.MSTOperationCallback;

				operation.MSTOperationCallback = function (inputData) {
					return callback(inputData, new RegExp(match[1], match[2]));
				};
			} else if (typeof match.index !== 'undefined') {
				const callback = operation.MSTOperationCallback;
				
				operation.MSTOperationCallback = function (inputData) {
					return callback(inputData, match[1]);
				};
			};

			return operation.MSTOperationCallback(inputData);
		};

		return function (operationInput) {
			if (__MSTIsGroup(operationInput)) {
				operationInput = operationInput.MSTGroupValue;

				const isJoin = operations.length === 1 && operationString.match(/^join/) && operationString.match(operations[0].MSTOperationPattern);

				if (isJoin && !Array.isArray(Object.values(operationInput)[0])) {
					return callback(Object.values(operationInput));
				};

				return {
					MSTGroupValue: Object.keys(operationInput).reduce(function (coll, item) {
						if (isJoin) {
							coll[item] = callback(coll[item]);
						} else {
							coll[item] = coll[item].map(callback);
						}

						return coll;
					}, operationInput),
				};
			};

			return callback(operationInput);
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

export const _MSTMassageType = function(inputData) {
	if (typeof inputData === 'string') {
		return 'String';
	}

	if (Array.isArray(inputData)) {
		return 'Array';
	};

	if (__MSTIsGroup(inputData)) {
		return 'Group';
	};

	if (typeof inputData === 'object' && inputData !== null) {
		return 'Object';
	};

	throw new Error('MSTErrorInputNotValid');
};

export const __MSTIsGroup = function (inputData) {
	if (typeof inputData !== 'object') {
		return false;
	};

	if (inputData === null) {
		return false;
	}

	if (typeof inputData.MSTGroupValue !== 'object' || inputData.MSTGroupValue === null) {
		return false;
	}

	return true;
};

export const __MSTGroupValue = function (inputData) {
	if (!__MSTIsGroup(inputData)) {
		throw new Error('MSTErrorInputNotValid');
	}

	return inputData.MSTGroupValue;
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
		MSTOperationPattern: /^prepend\(([^]+)\)$/,
		MSTOperationInputTypes: 'String,String',
		MSTOperationCallback: _MSTOperations.MSTStringPrepend,
	}, {
		MSTOperationPattern: /^postpend\(([^]+)\)$/,
		MSTOperationInputTypes: 'String,String',
		MSTOperationCallback: _MSTOperations.MSTStringPostpend,
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
		MSTOperationPattern: /^group\((\w+)\)$/,
		MSTOperationInputTypes: 'Array,String',
		MSTOperationCallback: _MSTOperations.MSTArrayGroup,
	}, {
		MSTOperationPattern: /^isMatch\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'Array,Regex',
		MSTOperationCallback: _MSTOperations.MSTArrayIsMatch,
	}, {
		MSTOperationPattern: /^match\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'Array,Regex',
		MSTOperationCallback: _MSTOperations.MSTArrayMatch,
	}, {
		MSTOperationPattern: /^remap\(([^]+)\)$/,
		MSTOperationInputTypes: 'Array,String',
		MSTOperationCallback: _MSTOperations.MSTArrayRemap,
	}, {
		MSTOperationPattern: /^print\(([^]+)\)$/,
		MSTOperationInputTypes: 'Array,String',
		MSTOperationCallback: _MSTOperations.MSTArrayPrint,
	}, {
		MSTOperationPattern: /^join\(([^]+)\)$/,
		MSTOperationInputTypes: 'Array,String',
		MSTOperationCallback: _MSTOperations.MSTArrayJoin,
	}, {
		MSTOperationPattern: /^remap\(([^]+)\)$/,
		MSTOperationInputTypes: 'Object,String',
		MSTOperationCallback: _MSTOperations.MSTObjectRemap,
	}, {
		MSTOperationPattern: /^print\(([^]+)\)$/,
		MSTOperationInputTypes: 'Object,String',
		MSTOperationCallback: _MSTOperations.MSTObjectPrint,
	}];
};

export const _MSTMassageTerminate = function (inputData) {
	if (__MSTIsGroup(inputData)) {
		inputData = __MSTGroupValue(inputData);
	}

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
		if (typeof inputData !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		return inputData.split('\n').filter(function (e) {
			return e.length;
		});
	},
	
	MSTStringPrepend (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		return param2 + param1;
	},
	
	MSTStringPostpend (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		return param1 + param2;
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
	
	MSTArrayRemap (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		};

		return param1.map(function (e) {
			return _MSTOperations.MSTObjectRemap(e, param2);
		});
	},
	
	MSTArrayPrint (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		};

		return param1.map(function (e) {
			return _MSTOperations.MSTObjectPrint(e, param2);
		});
	},
	
	MSTArrayJoin (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		};

		return param1.join(param2);
	},
	
	MSTArrayGroup (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		};

		return {
			MSTGroupKey: param2,
			MSTGroupValue: param1.reduce(function (coll, item) {
				(coll[item[param2]] = coll[item[param2]] || []).push(item);

				return coll;
			}, {}),
		};
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
	
	MSTObjectPrint (param1, param2) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		};

		return Object.keys(param1).reduce(function (coll, item) {
			return coll.replace(new RegExp(`\\$${ item }`, 'g'), param1[item]);
		}, param2);
	},

};
