import path from 'path';
import express from 'express';
import config from './webpack.config.prod.babel';

const app = new express();
const port = 3000;


/**
 * start server
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
const run = (cb) => {
    app.use(express.static(path.join(config.output.path)));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(config.output.path, 'index.html'));
    });

    app.listen(port, error => {
        /* eslint-disable no-console */
        if (error) {
            console.error(error);
        } else {
            console.info('  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
        }
        /* eslint-enable no-console */
    });

    if (typeof cb === 'function') {
        cb();
    };
};



export default run;
