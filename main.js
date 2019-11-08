const mod = {

MSTMassage (param1, param2) {
	if (typeof param1 !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	if (typeof param2 !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	return mod._MSTMassageTerminate(mod._MSTMassageOperations(param2).reduce(function (coll, item) {
		return item(coll);
	}, param1));
},

_MSTMassageOperations (inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	if (!inputData) {
		return [];
	}

	return mod.__MSTMassageOperationStrings(inputData).map(function (operationString) {
		const operations = mod.__MSTMassageOperations().filter(function (e) {
			return operationString.match(e.MSTOperationPattern);
		});

		if (!operations.length) {
			throw new Error('MSTErrorIdentifierNotValid');
		};

		return function (operationInput) {
			const callback = function (inputData, options = {}) {
				const operation = operations.filter(function (e) {
					if (!e.MSTOperationInputTypes) {
						return true;
					};

					return mod._MSTMassageInputTypes(e.MSTOperationInputTypes).shift() === mod._MSTMassageType(inputData);
				}).shift();

				if (!operation) {
					throw new Error('MSTErrorIdentifierNotValid');
				};

				const match = operationString.match(operation.MSTOperationPattern);
				let param2;

				if (typeof param2 === 'undefined' && mod._MSTMassageInputTypes(operation.MSTOperationInputTypes || '').pop() === 'Regex') {
					param2 = new RegExp(match[1], match[2]);
				}

				if (typeof param2 === 'undefined' && typeof match.index !== 'undefined') {
					param2 = match[1];
				};

				if (mod.__MSTIsGroup(operationInput) && mod._MSTMassageType(inputData) === 'String') {
					param2 = param2.split(`$${ operationInput.MSTGroupKey }`).join(options.MSTOptionGroupKey);
				};

				return operation.MSTOperationCallback(inputData, param2);
			};

			if (mod.__MSTIsGroup(operationInput)) {
				const inputData = operationInput.MSTGroupValue;

				const isJoin = operations.length === 1 && operationString.match(/^join/) && operationString.match(operations[0].MSTOperationPattern);

				if (isJoin && !Array.isArray(Object.values(inputData)[0])) {
					return callback(Object.values(inputData));
				};

				operationInput.MSTGroupValue = Object.keys(inputData).reduce(function (coll, item) {
					if (isJoin || !Array.isArray(coll[item])) {
						coll[item] = callback(coll[item], {
							MSTOptionGroupKey: item,
						});
					} else {
						coll[item] = coll[item].map(function (e) {
							return callback(e, {
								MSTOptionGroupKey: item,
							});
						});
					}

					return coll;
				}, inputData);

				return operationInput;
			};

			return callback(operationInput);
		};
	});
},

__MSTMassageOperationStrings (inputData) {
	return [].concat.apply([], [inputData.split('.')[0]].concat((inputData.split('').reverse().join('').match(/(\][^]+?\[)?(\)[^]+?\()?(\w+)\./g) || []).map(function (e) {
		e = e.split('').reverse().join('');

		const match = e.match(/(\[[^]+\])?$/);

		return [e.slice(0, match.index).split('.').slice(1).join('.')].concat(match[0] || []);
	}).reverse()));
},

_MSTMassageInputTypes(inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('MSTErrorInputNotValid');
	}

	return inputData.split(',').map(function (e) {
		return e.trim();
	}).filter(function (e) {
		return !!e;
	});
},

_MSTMassageType(inputData) {
	if (typeof inputData === 'string') {
		return 'String';
	}

	if (Array.isArray(inputData)) {
		return 'Array';
	};

	if (mod.__MSTIsGroup(inputData)) {
		return 'Group';
	};

	if (typeof inputData === 'object' && inputData !== null) {
		return 'Object';
	};

	throw new Error('MSTErrorInputNotValid');
},

__MSTIsGroup (inputData) {
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
},

__MSTGroupValue (inputData) {
	if (!mod.__MSTIsGroup(inputData)) {
		throw new Error('MSTErrorInputNotValid');
	}

	return inputData.MSTGroupValue;
},

__MSTMassageOperations () {
	return [{
		MSTOperationPattern: /^\$?input$/,
		MSTOperationCallback: mod._MSTOperations._MSTBypass
	}, {
		MSTOperationPattern: /^lines$/,
		MSTOperationInputTypes: 'String',
		MSTOperationCallback: mod._MSTOperations.MSTStringLines
	}, {
		MSTOperationPattern: /^conform\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'String,Regex',
		MSTOperationCallback: mod._MSTOperations.MSTStringConform,
	}, {
		MSTOperationPattern: /^capture\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'String,Regex',
		MSTOperationCallback: mod._MSTOperations.MSTStringCapture,
	}, {
		MSTOperationPattern: /^prepend\(([^]+)\)$/,
		MSTOperationInputTypes: 'String,String',
		MSTOperationCallback: mod._MSTOperations.MSTStringPrepend,
	}, {
		MSTOperationPattern: /^postpend\(([^]+)\)$/,
		MSTOperationInputTypes: 'String,String',
		MSTOperationCallback: mod._MSTOperations.MSTStringPostpend,
	}, {
		MSTOperationPattern: /^first$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: mod._MSTOperations.MSTArrayFirst,
	}, {
		MSTOperationPattern: /^last$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: mod._MSTOperations.MSTArrayLast,
	}, {
		MSTOperationPattern: /^\[([^]+)\]$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: mod._MSTOperations.MSTArrayAccess,
	}, {
		MSTOperationPattern: /^reverse$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: mod._MSTOperations.MSTArrayReverse,
	}, {
		MSTOperationPattern: /^unique$/,
		MSTOperationInputTypes: 'Array',
		MSTOperationCallback: mod._MSTOperations.MSTArrayUnique,
	}, {
		MSTOperationPattern: /^group\((\w+)\)$/,
		MSTOperationInputTypes: 'Array,String',
		MSTOperationCallback: mod._MSTOperations.MSTArrayGroup,
	}, {
		MSTOperationPattern: /^conform\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'Array,Regex',
		MSTOperationCallback: mod._MSTOperations.MSTArrayConform,
	}, {
		MSTOperationPattern: /^capture\(\/([^]+)\/(\w)?\)$/,
		MSTOperationInputTypes: 'Array,Regex',
		MSTOperationCallback: mod._MSTOperations.MSTArrayCapture,
	}, {
		MSTOperationPattern: /^remap\(([^]+)\)$/,
		MSTOperationInputTypes: 'Array,String',
		MSTOperationCallback: mod._MSTOperations.MSTArrayRemap,
	}, {
		MSTOperationPattern: /^print\(([^]+)\)$/,
		MSTOperationInputTypes: 'Array,String',
		MSTOperationCallback: mod._MSTOperations.MSTArrayPrint,
	}, {
		MSTOperationPattern: /^join\(([^]+)\)$/,
		MSTOperationInputTypes: 'Array,String',
		MSTOperationCallback: mod._MSTOperations.MSTArrayJoin,
	}, {
		MSTOperationPattern: /^remap\(([^]+)\)$/,
		MSTOperationInputTypes: 'Object,String',
		MSTOperationCallback: mod._MSTOperations.MSTObjectRemap,
	}, {
		MSTOperationPattern: /^print\(([^]+)\)$/,
		MSTOperationInputTypes: 'Object,String',
		MSTOperationCallback: mod._MSTOperations.MSTObjectPrint,
	}];
},

_MSTMassageTerminate (inputData) {
	if (mod.__MSTIsGroup(inputData)) {
		inputData = mod.__MSTGroupValue(inputData);
	}

	return mod.__MSTMassageTerminateFunction(inputData)(inputData);
},

__MSTMassageTerminateFunction (inputData) {
	if (typeof inputData !== 'string') {
		return JSON.stringify;
	}

	return mod._MSTOperations._MSTBypass;
},

_MSTOperations: {
	
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
	
	MSTStringConform (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		}

		if (!(param2 instanceof RegExp)) {
			throw new Error('MSTErrorInputNotValid');
		};

		return !!param1.match(param2);
	},
	
	MSTStringCapture (param1, param2) {
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
	
	MSTArrayConform (param1, param2) {
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
	
	MSTArrayCapture (param1, param2) {
		if (!Array.isArray(param1)) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (!(param2 instanceof RegExp)) {
			throw new Error('MSTErrorInputNotValid');
		};

		return param1.map(function (e) {
			return mod._MSTOperations.MSTStringCapture(e, param2).shift();
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
			return mod._MSTOperations.MSTObjectRemap(e, param2);
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
			return mod._MSTOperations.MSTObjectPrint(e, param2);
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
	
	MSTObjectAccess (param1, param2) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('MSTErrorInputNotValid');
		}

		return param1[param2];
	},
	
	MSTObjectRemap (param1, param2) {
		if (typeof param1 !== 'object' || param1 === null) {
			throw new Error('MSTErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('MSTErrorInputNotValid');
		};

		return mod._MSTOperations._MSTObjectRemap(param2)(param1);
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

},

};

Object.assign(exports, mod);
