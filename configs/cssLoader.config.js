import ExtractTextPlugin from 'extract-text-webpack-plugin';

const scssLoader = (env) => {

  const isProd = env === 'production';

  const cssLoaderOptions = {
    // modules: true,
    // localIdentName: isProd ? null : '[name]__[local]',
    // importLoaders:  1,
    sourceMap: isProd ? false : true,
  };


  // require option for postcss-loader,  
  // or will cause No PostCSS Config found error
  // https://www.npmjs.com/package/postcss-loader
  const postCssLoaderOptions = {
    plugins: (loader) => [
      require('postcss-import')({ root: loader.resourcePath, }),
      require('postcss-cssnext')({ warnForDuplicates: false, }),
      ...otherPlugins,
    ],
    sourceMap: isProd ? false : true,
  };

  const otherPlugins = !isProd ? [] : [require('autoprefixer')(), require('cssnano')(), ];

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
        ],
      }),
    };

    return environments[env];
  };

  const config = getLoaderUses(env);

  return Object.assign({}, {
    test: /(\.css|\.scss|\.sass)$/,
    use: config
  });
};


export default scssLoader;
