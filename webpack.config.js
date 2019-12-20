const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return {
        entry: "./src/index.js",
        mode: "development",
        output: {
            filename: "./main.js"
        },
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            port: 9000,
            watchContentBase: true,
            progress: true
        },

        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                modules: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(ico|png|svg|jpg|gif|ttf|woff2|woff|eot)$/,
                    use: ["file-loader"]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'public/index.html',
                filename: 'index.html',
                inject: 'body'
            }),
            new webpack.DefinePlugin(envKeys)
        ],
        resolve: {
            alias: {
                Book: path.resolve(__dirname, 'src/book/Book'),
                removeBook: path.resolve(__dirname, 'src/book/removeBook'),
                Books: path.resolve(__dirname, 'src/books/Books'),
                Cart: path.resolve(__dirname, 'src/cart/Cart'),
                addToCart: path.resolve(__dirname, 'src/cart/addToCart'),
                Login: path.resolve(__dirname, 'src/login/Login'),
                Orders: path.resolve(__dirname, 'src/orders/Orders'),
                Profile: path.resolve(__dirname, 'src/profile/Profile'),
                Users: path.resolve(__dirname, 'src/users/Users'),
                App: path.resolve(__dirname, 'src/App'),
                authenticationService: path.resolve(__dirname, 'src/authenticationService'),
                authHeader: path.resolve(__dirname, 'src/authHeader'),
                handleResponse: path.resolve(__dirname, 'src/handleResponse'),
                hashHistory: path.resolve(__dirname, 'src/history'),
                logout: path.resolve(__dirname, 'src/logout'),
                PrivateRoute: path.resolve(__dirname, 'src/PrivateRoute'),
            }
        }
    }
};
