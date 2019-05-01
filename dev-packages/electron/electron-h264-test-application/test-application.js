const electron = require('electron');

const timeout = 5000;
const headless = process.argv.some(arg => arg === '--headless');

let exitCode = undefined;

function exit(code, message) {
    if (typeof exitCode !== 'undefined') return;
    if (message) console.error('Error:', message);
    electron.app.exit(exitCode = code);
}

electron.app.on('ready', () => {
    const win = new electron.BrowserWindow({
        show: !headless,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    win.loadURL(`file://${require.resolve('./index.html')}`);

    electron.ipcMain
        // we expect the codecs to be missing.
        .on('error', () => exit(0))
        .on('success', () => exit(1, 'an h264 video can play'));

    win.webContents.on('dom-ready', () => {
        setTimeout(() => exit(2, 'timeout'), timeout);
    });
    win.on('closed', () => exit(3, 'aborted'));
});
