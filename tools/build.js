import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import shell from 'shelljs';
import webpack from 'webpack';
import devConfig from "../webpack.config.dev";
import prodConfig from "../webpack.config.prod";
import packageJson from '../package.json';


const buildMode = {
    DEV: 'dev',
    PROD: 'prod'
};

/**
 * run the build based on the mode and callback
 * @param  {[type]}   mode [the build mode, dev of prod]
 * @param  {Function} cb   [callback function]
 * @return {[type]}        [description]
 */
const run = (mode, cb) => {
    let config = devConfig;
    if (mode === buildMode.PROD) {
        config = prodConfig;
    }

    const spinner = ora('building for ' + mode + ' mode...\n');
    spinner.start();

    const assetsPath = path.join(config.output.path);
    shell.rm('-rf', assetsPath);
    shell.mkdir('-p', assetsPath);
    shell.config.silent = false;

    //build
    webpack(config).run((error, stats) => {
        spinner.stop();
        if (error) throw error;
        if (stats.hasWarnings()) {};//TODO
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
