const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const path = require('path');


module.exports = merge(baseWebpackConfig, {
  watch: true,
  devtool: 'source-map',
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8082',
      'webpack/hot/only-dev-server',
      './src/app.jsx',
    ],
  },
  output: {
    path: path.join(__dirname, './public/dist'),
    publicPath: 'http://localhost:8082/',
    filename: 'bundle-[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
