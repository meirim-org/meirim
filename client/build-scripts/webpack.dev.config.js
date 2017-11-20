const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');



module.exports = merge(baseWebpackConfig, {
	watch: true,
	devtool: "source-map",
	entry: {
		app: [
			'webpack-dev-server/client?http://localhost:8080',
			'webpack/hot/only-dev-server',
			'./src/app.jsx'
		]
	},
	output: {
		path: path.join(__dirname, "../public/dist"),
		publicPath: 'http://localhost:8080/',
		filename: 'bundle-[name].js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('development')
			}
		}),
		new FriendlyErrorsWebpackPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new ProgressBarPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			inject: 'body',
			template: path.join(__dirname, "../src/index.html")
		})
	]
});