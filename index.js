const path = require('path')
const fs = require('fs')
const core = require('@babel/core')
const traverse = require('@babel/traverse').default
const parser = require('@babel/parser')

const {
	entry,
	output,
	useEs6
} = require('./miniwebpack.config.js')
let outputDir = output.path;
let outputName = output.filename

if (!entry) throw Error('缺少必要参数entry');
outputName = outputName ? `${outputName}.js` : 'index.js';
outputDir = path.resolve(__dirname, outputDir || 'dist', outputName);

function getAst(entryVal) {
	const code = fs.readFileSync(entryVal, 'utf-8');
	const ast = parser.parse(code, {
		sourceType: "module"
	})
	return ast;
}

function launchTraverse(ast, entryPath) {
	const dependencies = {};
	traverse(ast, {
		ImportDeclaration(node) {
			if (!node.node.source.value) return;
			const nodePath = './' + path.relative(__dirname, path.resolve(path.dirname(entryPath), node.node.source.value));
			dependencies[node.node.source.value] = nodePath;
		}
	})
	return dependencies;
}

function getTransformCode(ast, isUseEs6) {
	const {
		code: transformCode
	} = core.transformFromAstSync(ast, null, isUseEs6 ? {
		presets: [
			"@babel/preset-env"
		]
	} : {})
	return transformCode;
}

const graph = {};

function getGraph(entryVal) {
	const entryPath = path.resolve(__dirname, entryVal);
	const ast = getAst(entryVal);
	const dependencies = launchTraverse(ast, entryPath);

	const rootRelatePath = './' + path.relative(__dirname, entryPath);
	graph[rootRelatePath] = {
		code: getTransformCode(ast, useEs6),
		dependencies
	}
	for (const i in graph) {
		if (Object.keys(graph[i].dependencies).length > 0) {
			for (const j in graph[i].dependencies) {
				if (graph[graph[i].dependencies[j]]) break;
				getGraph(graph[i].dependencies[j]);
			}
		} else continue;
	}
	return graph;
}

function evalCode(entryVal) {
	getGraph(entryVal);
	return `(function(entry,graph){
		var exports = {};
		var obj = JSON.parse(graph)
		function localRequire(entry){
			return obj[entry].code
		}
		(function(require, exports, code){
			eval(code)
		})(localRequire, exports, obj[entry].code)
	})('${entryVal}','${JSON.stringify(graph)}')`;
}

const outputCode = evalCode(entry);
try{
	fs.accessSync(path.dirname(outputDir))
}catch(e){
	fs.mkdirSync(path.dirname(outputDir));
}
fs.writeFileSync(outputDir, outputCode)
