module.exports = {
	'env': {
		'commonjs': true,
		'node': true,
		'es6': true,
		"jest": true,
		'browser':true,
	},
	'extends': ['eslint:recommended'],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2018
	},
	'rules': {
		"camelcase": 'off',
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'object-curly-spacing': ['error', 'always']
	}
};