import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import postCssNext from 'postcss-cssnext';

export default {
    plugins: [
        postCssNext({
            features: {
                customProperties: {
                    variables: Object.assign({}, {} //TODO
                    )
                }
            }
        })
    ]
};


export const scssLoader = (env) => {

    const isProd = env === 'production';

    const cssLoaderOptions = {
        //modules: true,
        //localIdentName: isProd ? null : '[name]__[local]',
        //importLoaders:  1,
        sourceMap: isProd ? false : true,
    };


    //require option for postcss-loader,  
    //or will cause No PostCSS Config found error
    const postCssLoaderOptions = {
        plugins: (loader) => [
            require('autoprefixer')(),
        ],
        sourceMap: isProd ? false : true,
    };

    const getLoaderUses = env => {

        const environments = {
            development: [
                { loader: 'style-loader' },
                { loader: 'css-loader', options: cssLoaderOptions },
                { loader: 'postcss-loader', options: postCssLoaderOptions },
                { loader: 'sass-loader' },
            ],
            production: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    { loader: 'css-loader', options: cssLoaderOptions },
                    { loader: 'postcss-loader', options: postCssLoaderOptions },
                    { loader: 'sass-loader?sourceMap' },
                ]
            })
        };

        return environments[env];
    };

    const config = getLoaderUses(env);

    return Object.assign({}, {
        test: /(\.css|\.scss|\.sass)$/,
        use: config
    });
};
