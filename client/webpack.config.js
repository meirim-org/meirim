var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

    module.exports = {
    context: __dirname,
    entry: {
        'login': ['./pages/login.js'],

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
    plugins: [],
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ["react", "es2015-loose"],
                    plugins: [
                        ['import', { libraryName: "antd", style: true }]
                    ]
                }
            },
            {
                test: /\.css$/,
                loader: 'less-loader!style-loader!css-loader'
            },
            {
                test: /\.less$/,
                use: ["style-loader", {loader: 'css-loader', options: {sourceMap: 1}}, "less-loader"]
            }
        ]
    }

};


