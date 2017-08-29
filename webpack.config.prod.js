// For info about this file refer to webpack and webpack-hot-middleware documentation
// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';


const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __DEV__: false
};

// publicPath: 'https://franksoong.github.io/elite/',
export const publicPath = '';

export default {
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json']
    },
    devtool: false, //'eval', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    entry: path.resolve(__dirname, 'src/index'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',   //path.join(publicPath)
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        // Hash the files using MD5 so that their names change when the content changes.
        new WebpackMd5Hash(),

        // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
        new webpack.DefinePlugin(GLOBALS),

        // Generate an external css file with a hash in the filename
        new ExtractTextPlugin('[name].[contenthash].css', {
            allChunks: false
        }),

        // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
        // https://github.com/kangax/html-minifier#options-quick-reference
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: 'My Todos',
            favicon: 'src/favicon.ico',
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true,
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: '[name].[chunkhash].js',   
            //path.join('vendors.js'),  wrong path could cause endless building... so pain
        }),

        // Minify JS, https://github.com/mishoo/UglifyJS2#usage
        // http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: false
            },
            sourceMap: false,
            output: { comments: false },
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            noInfo: true, // set to false to see a list of every file being bundled.
            options: {
                sassLoader: {
                    includePaths: [path.resolve(__dirname, 'src', 'scss')]
                },
                context: '/',
                postcss: () => [autoprefixer],
            }
        })
    ],
    module: {
        loaders: [
            // Load ES6/JSX
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [path.resolve(__dirname, 'src')],
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
};
