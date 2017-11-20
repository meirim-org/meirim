var ora = require('ora');
var webpack = require('webpack');
var webpackConfig = require('./webpack.prod.config');

var spinner = ora('building for production...').start();

webpack(webpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err;
});
