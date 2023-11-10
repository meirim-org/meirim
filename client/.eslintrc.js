module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
		'prettier'
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'cypress',
		'react'
	],
	'rules': {
		'semi': ["error", "always"],
		'indent': 'off',
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'newline-before-return': [
			'error'
		],
		"object-curly-spacing": ["error", "always"],
		"keyword-spacing": ["error", { "before": true }],
		"array-callback-return": "off"
	}
}
