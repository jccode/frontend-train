"use strict";

require('babel-polyfill');

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const PATHS = {
    src: path.join(__dirname, 'app'),
    dist: path.join(__dirname, 'dist')
};

// babelrc
const babelrc = fs.readFileSync(path.join(__dirname, '.babelrc'));
let babelConfig;
try {
    babelConfig = JSON.parse(babelrc);
} catch (err) {
    console.error('==> ERROR: Error parsing your .babelrc.');
    console.error(err);
}

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
}

const apps = getDirectories(PATHS.src);
const entry = apps.reduce((total, curr) => {
    let arr = ["babel-polyfill", path.join(PATHS.src, curr, "index.js")];
    total[curr] = arr;
    return total;
}, {});


module.exports = {

    context: PATHS.src,
    
    entry: entry,
    
    output: {
        path: PATHS.dist,
        filename: '[name].bundle.js',
        chunkFilename: "[id].chunk.js",
        publicPath: '/'
    },
    
    devtool: "source-map",//"cheap-eval-source-map",
    
    module: {
        rules: [
            {test: /\.html$/, use: [ {loader: 'html-loader', options: {minimize: true}}]},
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        // alias: {
                        //     "../fonts/bootstrap": "bootstrap-sass/assets/fonts/bootstrap"
                        // }
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: [
                            'node_modules', 'bower_components', 'src', '.'
                        ]
                    }
                }]
            },

            {test: /\.css$/, loader: "style-loader!css-loader"},
            
            // {test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/, use: [{loader: "file-loader"}]},
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },

            {test: /\.(png|jpg|ico|gif)$/, loader: 'file-loader'},
            
            {test: /\.flv$|\.mp4$/, use: [{loader: "file-loader"}]},
            {test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/, query: babelConfig},
        ]
    }
};
