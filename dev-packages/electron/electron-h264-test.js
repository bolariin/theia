#!/usr/bin/env node

const cp = require('child_process');

const electronApp = cp.fork(require.resolve('./electron-cli.js'), [
    require.resolve('./electron-h264-test-application/test-application.js'),
    '--headless',
]);

electronApp.on('error', error => {
    console.error(error);
    process.exit(127);
})

electronApp.on('close', (code, signal) => {
    if (code || signal) process.exit(code || 1);
    else process.exit(0);
})
