const downloadElectron = require('electron-download');
const unzipper = require('unzipper');
const fs = require('fs');

async function main() {
    const electronVersionFilePath = require.resolve('electron/dist/version');
    const electronVersion = fs.readFileSync(electronVersionFilePath, {
        encoding: 'utf8'
    }).trim();

    const libffmpegZipPath = await new Promise((resolve, reject) => {
        downloadElectron({
            // `version` usually starts with a `v`, which already gets added by `electron-download`.
            version: electronVersion.slice(1),
            ffmpeg: true,
        }, (error, path) => {
            if (error) reject(error);
            else resolve(path);
        });
    });

    const ffmpeglib = libffmpegFileName();
    const libffmpegZip = await unzipper.Open.file(libffmpegZipPath);

    file = libffmpegZip.files.find(file => file.path.endsWith(ffmpeglib));
    if (!file) throw new Error(`archive did not contain "${ffmpeglib}"`);
    const electronFfmpegLibPath = require.resolve(`electron/dist/${ffmpeglib}`);

    await new Promise((resolve, reject) => {
        file.stream()
            .pipe(fs.createWriteStream(electronFfmpegLibPath))
            .on('finish', resolve)
            .on('error', reject);
    });
}

function libffmpegFileName() {
    switch (process.platform) {
        case 'darwin':
            return 'libffmpeg.dylib';
        case 'linux':
            return 'libffmpeg.so';
        case 'win32':
            return 'ffmpeg.dll';
        default:
            throw new Error(`${process.platform} is not supported.`);
    }
}

if (!process.env.THEIA_ELECTRON_SKIP_REPLACE_FFMPEG) {
    main().catch(error => {
        console.error(error);
        process.exit(1);
    });
}
