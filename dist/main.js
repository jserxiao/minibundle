(function(entry,graph){
		var exports = {};
		var obj = JSON.parse(graph)
		function localRequire(entry){
			return obj[entry].code
		}
		(function(require, exports, code){
			eval(code)
		})(localRequire, exports, obj[entry].code)
	})('./src/index.js','{"./src\\index.js":{"code":"\"use strict\";\n\nvar _second = _interopRequireDefault(require(\"./second.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(\"mini\" + _second[\"default\"]);","dependencies":{"./second.js":"./src\\second.js"}},"./src\\second.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _word = require(\"./word.js\");\n\nconsole.log(_word.word);\nvar _default = _word.word;\nexports[\"default\"] = _default;","dependencies":{"./word.js":"./src\\word.js"}},"./src\\word.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.word = void 0;\nvar word = \"webpack\";\nexports.word = word;","dependencies":{}}}')