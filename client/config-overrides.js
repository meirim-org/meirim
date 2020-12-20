const { override } = require('customize-cra');
const rewireStyledComponents = require('react-app-rewire-styled-components');
const webpack = require('webpack');

const addHandleBarsLoader = config => {
    if (process.env.NODE_ENV !== 'production') {
        // add handlebars-loader so that handlebars templates in
        // webpack-dev-server's served html files are parsed
        // (specifically the meta tags)
        config.module.rules.push({test: /\.html$/, loader: 'handlebars-loader'});
    }

    return config;
}

const addStyledComponentsDebug = (config, env) => {
    if (process.env.NODE_ENV !== 'production') {
        config = rewireStyledComponents(config, env);
    }

    return config;
}

const addClientConfigPlugin = config => {
    config.plugins.push(new webpack.DefinePlugin({ 'process.env.CONFIG': JSON.stringify(require('config')) }));
    return config;
};

module.exports = override(
    addHandleBarsLoader,
    addStyledComponentsDebug,
    addClientConfigPlugin
);
