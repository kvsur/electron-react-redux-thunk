/**
 * Created by LeeCH at July 17th, 2019 2:53pm
 */
const { ipcMain, app, BrowserWindow, Tray, Menu } = require('electron');
let { autoUpdater } = require('electron-updater');
const exec = require('child_process').execFile;
const path = require('path');
const fs = require('fs');
const appConfig = require('./app.config');
const Schedule = require('./schedule');
// const updateJavaService = require('./service.update');
const restartJava = require('./restart.java');
const Boot = require('./boot');
const { JAVA_SERVER_ROOT_NAME, RESTART_TIME_INTERVAL } = require('./constant');

const feedOption = {
    "provider": "generic",
    "url": 'http://172.19.80.224/packages/docker_images/teaching_package/'
};

const rootPath = path.join(__dirname, `../../../`);
const servicePath = `${rootPath}${JAVA_SERVER_ROOT_NAME}`;

let restartTimer = null;

/**
 * Keep *** window *** Object reference in global context, If not, it will be GC and close.
 */
let win;

let tray;
let tipForFrontEnd = false;

function process_emiter(...arg) {
    win.webContents.send('process_event', arg[0], ...arg.splice(1));
}

function hanldeUpateFromRender() {
    // Start update action
    autoUpdater.checkForUpdates();
}

function updateHandle() {
    // const os = require('os');

    autoUpdater.setFeedURL(feedOption.url);
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.logger = console;
    autoUpdater.on('error', function (error) {
        // dialog.showErrorBox('error', error)
        if (tipForFrontEnd) {
            process_emiter('update-close', error);
            tipForFrontEnd = false;
        }
    });
    autoUpdater.on('update-available', async function (info) {
        const fn = () => {
            clearInterval(restartTimer);
            autoUpdater.downloadUpdate();
            ipcMain.removeListener('download-update', fn);
        }
        ipcMain.on('download-update', fn);

        process_emiter('update-available-choose', info);
    });

    autoUpdater.on('update-not-available', function (info) {
        if (tipForFrontEnd) {
            process_emiter('update-not-available', {version: app.getVersion()});
            tipForFrontEnd = false;
        }
        process_emiter('update-not-available-only-version', {version: app.getVersion()});
    });

    // Event for download progress 
    autoUpdater.on('download-progress', function (progressObj) {
        process_emiter('download-progress', progressObj);
    });

    autoUpdater.on('update-downloaded', async function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        const fn = (e, arg) => {
            clearInterval(restartTimer);
            autoUpdater.quitAndInstall();
            ipcMain.removeListener('install-now', fn);
        }
        ipcMain.on('install-now', fn);

        process_emiter('update-downloaded-choose')
    });

    ipcMain.on("check-update", hanldeUpateFromRender);
}

async function createWindow() {
    // Create main window for client
    win = new BrowserWindow({ ...appConfig });
    // await updateJavaService({
    //     rootPath,
    //     // emitor: win.webContents, 
    //     dialog,
    //     userDataPath: app.getPath('userData'),
    //     appPath: app.getAppPath(),
    //     version: app.getVersion(),
    //     needUpdateNow: true
    // });

    await restartJava({ servicePath, firstTime: 1 });

    // Protect java process
    restartTimer = setInterval(() => {
        restartJava({ servicePath, emitor: win.webContents });
    }, RESTART_TIME_INTERVAL);

    // win.setMenu(null);

    // Load index.html file 
    win.loadFile('build_web/index.html');

    // win.webContents.openDevTools();

    // It called after window closed
    win.on('closed', () => {
        win = null
    });

    win.on('maximize', () => {
        process_emiter('win-max', true);
    });

    win.on('unmaximize', () => {
        process_emiter('win-max', false);
    });

    ipcMain.on('resize', (_, height) => {
        win.setSize(appConfig.width, height || 432, true);
        // console.log(height)
    });

    ipcMain.on('minus', e => {
        win.minimize();
        global.isAppHide = true;
    });
    ipcMain.on('max', e => {
        if (win.isMaximized() || win.isFullScreen()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });
    ipcMain.on('close', e => {
        // win.close();
        win.hide();
        global.isAppHide = true;
    });

    ipcMain.on('show', e => {
        win.show();
        global.isAppHide = false;
    });

    // schedule 
    new Schedule(ipcMain, win);

    tray = new Tray(path.join(__dirname, '../build_web/favicon.ico'));
    const contextMenu = Menu.buildFromTemplate([
        // {
        //     label: '重启服务[DEV]',
        //     click: function () {
        //         win.show();
        //         restartJava({ servicePath, emitor: win.webContents, firstTime: 1 });
        //     }
        // },
        // {
        //     label: '开发工具[DEV]',
        //     // icon: path.join(__dirname, './icons/udpate16.png'),
        //     click: function () {
        //         win.show();
        //         win.webContents.openDevTools();
        //     }
        // },
        {
            label: '设备授权',
            icon: path.join(__dirname, './icons/code16.png'),
            click: function () {
                win.show();
                process_emiter('do-authorize');
            }
        },
        {
            label: '开启/关闭自启动',
            icon: path.join(__dirname, './icons/boot16.png'),
            click: function () {
                win.show();
                const appName = app.getName();
                const appPath = process.execPath;

                if (appPath.indexOf(`${appName}.exe`) < 0) {
                    process_emiter('service-tip', { type: 'error', message: '开发者模式下不能设置自启动' });
                    return;
                };

                Boot.getAutoStartValue({ name: appName }, (e, r) => {
                    if (e || r !== appPath) {
                        Boot.enableAutoStart({ name: appName, file: appPath }, e => {
                            if (!e) {
                                process_emiter('service-tip', { type: 'info', message: '已设置自启动' });
                            } else {
                                process_emiter('service-tip', { type: 'error', message: '设置自启动失败' });
                            }
                        });
                    } else {
                        const fn = (_, choose) => {
                            if (choose) {
                                Boot.disableAutoStart({ name: appName, file: appPath }, e => {
                                    if (!e) {
                                        process_emiter('service-tip', { type: 'info', message: '已取消设置自启动' });
                                    } else {
                                        process_emiter('service-tip', { type: 'error', message: '取消设置自启动失败' });
                                    }
                                });
                            }
                            ipcMain.removeListener('boot-choose-res', fn);
                        }

                        ipcMain.on('boot-choose-res', fn);

                        process_emiter('boot-choose');
                    }
                })
            }
        },
        {
            label: '卸载客户端',
            icon: path.join(__dirname, './icons/uninstaller16.png'),
            click: async function () {
                win.show();
                const appName = app.getName();
                const appPath = process.execPath;

                if (appPath.indexOf(`${appName}.exe`) < 0) {
                    process_emiter('service-tip', { type: 'error', message: '开发者模式禁止卸载操作' });
                    return;
                };

                const uninstallerPath = `${app.getAppPath()}\\uninstaller.bat`;

                try {
                    const UNINSTExist = await fs.existsSync(uninstallerPath);
                    if (UNINSTExist) {
                        const cwd = app.getAppPath();
                        exec(uninstallerPath, null, { cwd }, (err, res) => {
                            if (err) {
                                throw new Error('');
                            }
                        });
                    }
                } catch(e) {
                    process_emiter('service-tip', { type: 'error', message: '启动卸载程序失败' });
                }
            }
        },
        {
            label: '版本信息',
            icon: path.join(__dirname, './icons/versions16.png'),
            click: function () {
                win.show();
                process_emiter('version-info', { appVersion: app.getVersion() });
            }
        },
        {
            label: '检测更新',
            icon: path.join(__dirname, './icons/udpate16.png'),
            click: function () {
                win.show();
                tipForFrontEnd = true;
                hanldeUpateFromRender();
            }
        },
        {
            label: '退出',
            icon: path.join(__dirname, './icons/exit16.png'),
            click: function () {
                clearInterval(restartTimer);
                app.quit();
            }
        },
    ]);
    tray.setToolTip('教育语音分析系统');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        win.show();
        global.isAppHide = false;
    });

    updateHandle();
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // If user start second instance client, open and show current 'this' window
        if (win) {
            if (win.isMinimized()) win.restore();

            win.show();
        }
    })
}

/**
 * Do everything about *** window *** after app ready
 */
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // Do these for Mac OS
    if (process.platform !== 'darwin') {
        // Stop protect java processS
        clearInterval(restartTimer);
        app.quit();
    }
});

app.on('activate', () => {
    // Do these for Mac OS
    if (win === null) {
        createWindow();
    }
});

