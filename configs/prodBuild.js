import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import shell from 'shelljs';
import webpack from 'webpack';
import config from "./webpack.config.prod.babel";
import packageJson from '../package.json';


/**
 * run the build based on the mode and callback
 * @param  {Function} cb   [callback function]
 * @return {[type]}        [description]
 */
const run = (cb) => {

    const spinner = ora('building for production mode...\n');
    spinner.start();

    //build
    webpack(config).run((error, stats) => {
        spinner.stop();
        if (error) throw error;
        process.stdout.write(stats.toString({
            colors: true,
            modules: true,
            //reasons:true,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        console.log(chalk.cyan('  Build complete for package ', packageJson.name, '.\n'));
        console.log(chalk.yellow('  Tip: built files are meant to be served over an HTTP server.\n'));

        if (typeof cb === 'function') {
            cb();
        };
    });
};


export default run;
