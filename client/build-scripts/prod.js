const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.config');


webpack(webpackConfig, function (err, stats) {
  if (err) throw err;
});
