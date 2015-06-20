// Like babel.js but much smaller, without fundations and not totally right.
// It probably won't stay long.

'use strict';

if (Object.assign) {
	console.log('Object.assign polyfill can be removed from code :)');
} else {
	Object.defineProperty(Object, 'assign', { // from the MDN
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(target) {
			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) continue;
				nextSource = Object(nextSource);
				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
			return to;
		}
	});
}

