const path = require('path');
module.exports = function(env) {
    const production = process.env.NODE_ENV === 'production';
    return {
        devtool: production ? 'source-maps' : 'eval',
        entry: ['babel-polyfill', './js/app.js'],
        output: {
            path: path.resolve(__dirname, '../priv/static/'),
            filename: 'js/app.js',
            publicPath: '/',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'css/[name].[ext]',
                        }
                    },
                },
                {
                    test: /\.(png|jpe?g|gif)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]',
                        }
                    },
                },
                {
                    test: /\.(ico|txt)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                        }
                    },
                },
            ]
        },
        resolve: {
            modules: ['node_modules', path.resolve(__dirname, 'js')],
            extensions: ['.js'],
            alias: {
                phoenix: path.resolve(__dirname, '../deps/phoenix/assets/js/phoenix.js'),
                phoenix_html: path.resolve(__dirname, '../deps/phoenix_html/priv/static/phoenix_html.js'),
            }
        },
    };
};