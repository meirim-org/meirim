var path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".js", ".jsx", ".json", '.scss'],
	},
	module: {
		rules: [

			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader', // The backup style loader
					use: ['css-loader?sourceMap', 'sass-loader?sourceMap']
				})
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: '[name].min.css',
			allChunks: false
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				eslint: {
					failOnWarning: false,
					failOnError: false,
					fix: false,
					quiet: false,
				},
			},
		})
	]
};