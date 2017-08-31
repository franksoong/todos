import config from './webpack.config';
import webpack from 'webpack';
import path from 'path';

export default config({
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],
});
