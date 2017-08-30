import config from './webpack.config';
import webpack from 'webpack';
import path from 'path';

const basePath = path.join(__dirname, '..', 'src');


export default config({
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
            noInfo: true, // set to false to see a list of every file being bundled.
            options: {
                sassLoader: {
                    includePaths: [path.join(basePath, 'assets', 'scss')]
                },
                context: '/',
                postcss: () => [autoprefixer],
            },
        }),
    ],
});
