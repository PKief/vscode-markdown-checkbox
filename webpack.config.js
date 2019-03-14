'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
    target: 'node',

    entry: './src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            "module": "es6" // override `tsconfig.json` so that TypeScript emits native JavaScript modules.
                        }
                    }
                }]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
};

module.exports = config;
