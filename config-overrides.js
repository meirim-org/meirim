const path = require('path');
const { override, addExternalBabelPlugin, babelInclude } = require('customize-cra');

const addHandleBarsLoader = config => {
    // add handlebars-loader so that handlebars templates in
    // webpack-dev-server's served html files are parsed
    // (specifically the meta tags)
    config.module.rules.push({ test: /\.html$/, loader: 'handlebars-loader' });
    return config;
}

module.exports = override(
    addHandleBarsLoader,
    addExternalBabelPlugin('@babel/plugin-proposal-class-properties'),
    babelInclude([
        path.resolve('src'),
        path.resolve('node_modules/rn-sliding-up-panel'),
    ]),
);
