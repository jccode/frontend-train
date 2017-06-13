
var path = require('path');

module.exports = {
    entry: './app/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "cheap-eval-source-map",
    
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }]
            },
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
                        // includePaths: [
                        //     path.resolve("./node_modules/bootstrap-sass/assets/stylesheets")
                        // ]
                    }
                }]
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
                use: [{
                    loader: "file-loader"
                }]
            }
        ]
    }
};
