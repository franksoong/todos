import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';


const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: true
};


export const publicPath = '/static/';


export default {
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json']
    },
    devtool: 'eval',
    entry: path.resolve(__dirname, 'src/index'),
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/static/',   // path.join(publicPath) cause error! 
        filename: 'bundle.js',
    },
    plugins: [
        // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
        new webpack.DefinePlugin(GLOBALS),

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
                minifyJS: false,
                minifyCSS: false,
                minifyURLs: false
            },
            inject: true,
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
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/,
            include: __dirname,
        }],
    },
};