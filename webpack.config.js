const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
let apiHost = '';

module.exports = env => {
    apiHost = process.env.ENDPOINT || 'http://localhost:8090';
    return {
        entry: './src/index.js',
        module: {
            rules: [
                {
                    test: /\.(html)$/,
                    loader: 'raw-loader'
                },
                {
                    test: /\.css$/,
                    include: /src|node_modules/,
                    use: ["to-string-loader", "style-loader", "css-loader"]
                },
                {
                    test: /\.js$/,
                    use: "babel-loader",
                    exclude: /node_modules/,
                },
            ]
        },
        resolve: {
            extensions: ['.js'],
            alias: {
                '@': path.resolve(__dirname, 'src/'),
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
                inject: 'body'
            }),
            new webpack.DefinePlugin({
                config: JSON.stringify({
                    apiUrl: apiHost
                })
            })
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
            runtimeChunk: true
        },
        devServer: {
            historyApiFallback: true
        }
    };
};
