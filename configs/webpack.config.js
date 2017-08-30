/* global __dirname */
import webpack from 'webpack';
import path from 'path';
import packageJson from '../package.json';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';


const basePath = path.join(__dirname, '..', 'src');
const env = process.env.NODE_ENV || 'development';



console.log('Webpack running in ' + env);

export default ({
    plugins = [],
    resolve = {},
    devtool = 'eval',
}) => {
    return {
        entry: {
            app: path.join(basePath, 'index'),
            vendor: Object.keys(packageJson.dependencies),
        },

        output: {
            path: path.join(basePath, '..', 'out'), //output path
            publicPath: env === 'development' ? '/' : '', //serve path
            filename: '[name].[hash].js',
        },

        // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
        devtool,

        plugins: [
            // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
            // https://github.com/kangax/html-minifier#options-quick-reference
            new HtmlWebpackPlugin({
                template: path.join(basePath, 'index.html'),
                title: 'My Todos',
                favicon: path.join(basePath, 'favicon.ico'),
                minify: false,
                inject: true,
            }),

            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: '[name].[hash].js'
            }),

        ].concat(plugins),

        resolve: Object.assign({}, {
            extensions: ['*', '.js', '.jsx', '.json'],

            modules: [
                'node_modules',
                'app'
            ],

            alias: {},

        }, resolve),

        module: {
            loaders: [
                // Load ES6/JSX
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    include: [basePath],
                },

                // Load fonts
                {
                    test: /\.eot(\?v=\d+.\d+.\d+)?$/,
                    loader: 'url-loader?name=[name].[ext]'
                }, {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]'
                }, {
                    test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[ext]'
                }, {
                    test: /\.svg(\?v=\d+.\d+.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=[name].[ext]'
                },

                // Load images
                // difference for url-loader and file-loader:
                // The url-loader works like the file-loader, but can return a DataURL if the file is smaller than a byte limit.
                {
                    test: /\.jpe?g/,
                    loader: 'url-loader?limit=10000&mimetype=image/jpg'
                }, {
                    test: /\.gif/,
                    loader: 'url-loader?limit=10000&mimetype=image/gif'
                }, {
                    test: /\.png/,
                    loader: 'url-loader?limit=10000&mimetype=image/png'
                }, {
                    test: /\.svg/,
                    loader: 'url-loader?limit=10000&mimetype=image/svg'
                }, {
                    test: /\.ico$/,
                    loader: 'url-loader?limit=10000'
                },

                // Load styles
                {
                    test: /(\.css|\.scss|\.sass)$/,
                    loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
                }
            ]
        },

        devServer: {
            //Display no info to console (only warnings and errors)
            noInfo: true,
            port: 3000,
            contentBase: path.join(basePath, 'assets'),
            proxy: {},
            historyApiFallback: false,
            compress: true,
            open: true,
            clientLogLevel: "info",
            setup: function(app) {
                // Here you can access the Express app object and add your own custom middleware to it.
                // For example, to define custom handlers for some paths:
                // app.get('/some/path', function(req, res) {
                //   res.json({ custom: 'response' });
                // });
            },
        },
    };
};
