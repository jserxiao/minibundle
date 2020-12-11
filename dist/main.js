(function(entry,graph){
		var exports = {};
		var obj = JSON.parse(graph);
		function analize(entryVal){
			function localRequire(r_entry){
				analize(obj[entryVal].dependencies[r_entry])
				return exports;
			}
			return (function(require, exports, code){
				eval(code)
			})(localRequire, exports, obj[entryVal].code)
		}
		analize(entry)
	})('./src/index.js',`{"./src/index.js":{"code":"'use strict';var _second = _interopRequireDefault(require('./second.js'));function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }console.log('mini' + _second['default']);","dependencies":{"./second.js":"./src/second.js"}},"./src/second.js":{"code":"'use strict';Object.defineProperty(exports, '__esModule', {  value: true});exports['default'] = void 0;var _word = require('./word.js');console.log(_word.word);var _default = _word.word;exports['default'] = _default;","dependencies":{"./word.js":"./src/word.js"}},"./src/word.js":{"code":"'use strict';Object.defineProperty(exports, '__esModule', {  value: true});exports.word = void 0;var word = 'webpack';exports.word = word;","dependencies":{}}}`)