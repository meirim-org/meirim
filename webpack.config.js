const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'client', 'app.js'),
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }

  // ,
  // plugins: [
  //   new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  //   }),
  //   new webpack.optimize.DedupePlugin(),
  //   new webpack.optimize.OccurenceOrderPlugin(),
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: { warnings: false },
  //     mangle: true,
  //     sourcemap: false,
  //     beautify: false,
  //     dead_code: true
  //   })
  // ]
};
