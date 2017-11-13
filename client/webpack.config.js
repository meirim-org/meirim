var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

module.exports = {
	context: __dirname,
	entry: {
		'login': ['./pages/login.js'],
		'syndrome-list': ['./pages/syndrome-list.js'],
		'syndromePage': ['./pages/syndromePage.js'],
		'approvePage': ['./pages/approvePage.js'],
	},
	output: {
		path: resolve('../public/js/pages'),
		filename: "[name].js"
	},
	devtool: 'source-map',
	resolve: {
		modules: ["web_modules", "node_modules", "./"],
		extensions: ['.js', '.jsx'],
		alias: {
			'react': resolve('node_modules/react'),
			'asn1.js': 'node_modules/asn1.js/'
		}
	},
	plugins: [
		new ExtractTextPlugin({
            filename: '[name].min.css',
            allChunks: false
        })
	],
	module: {
		rules: [{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ["react", "es2015-loose"],
					plugins: [
						['import', {
							libraryName: "antd",
							style: true
						}]
					]
				}
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader', // The backup style loader
					use: ['css-loader?sourceMap', 'sass-loader?sourceMap']
				})
			},
		]
	}

};