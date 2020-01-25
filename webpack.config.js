const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/js/index.js'], // file to start looking for import and exports
    output: {
        path: path.resolve(__dirname, 'dist'), // absolute path of the output file
        filename: 'js/bundle.js' // file to write the output
    },
    devServer: {
        contentBase: './dist' // creates a local live server which the contents of this folder
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html' // which html to copy
        })
    ],
    module: { 
        rules: [ // rules is for converting latest js code back to ES5 code 
            {
                test: /\.js$/, // convert all files ending with '.js' 
                exclude: /node_modules/, // don't convert files inside node-modules folder
                use: {
                    loader: 'babel-loader' // uses babel-loader for converting
                }
            }
        ]
    }
};