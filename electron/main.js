const { ipcMain, app, BrowserWindow, Tray, Menu, dialog } = require('electron');
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

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win;
let tray;
let tipForFrontEnd = false;

function process_emiter(...arg) {
    win.webContents.send('process_event', arg[0], ...arg.splice(1));
}

function hanldeUpateFromRender() {
    //执行自动更新检查
    // process_emiter('update-start');
    autoUpdater.checkForUpdates();
}

function updateHandle() {
    const message = {
        error: '检查更新出错',
        checking: '正在检查更新...',
        updateAva: '正在下载更新...',
        updateNotAva: '当前版本为最新版本',
    };
    // const os = require('os');

    autoUpdater.setFeedURL(feedOption.url);
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.logger = console;
    autoUpdater.on('error', function (error) {
        // dialog.showErrorBox('error', error)
        sendUpdateMessage(message.error);
        if (tipForFrontEnd) {
            process_emiter('update-close', error);
            tipForFrontEnd = false;
        }
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking);
    });
    autoUpdater.on('update-available', async function (info) {
        const fn = () => {
            clearInterval(restartTimer);
            autoUpdater.downloadUpdate();
            ipcMain.removeListener('download-update', fn);
        }
        ipcMain.on('download-update', fn);

        sendUpdateMessage(message.updateAva);
        process_emiter('update-available-choose', info);
    });

    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva);
        if (tipForFrontEnd) {
            process_emiter('update-not-available', info);
            tipForFrontEnd = false;
        }
    });

    // 更新下载进度事件
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

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    process_emiter('update-message', text);
}

async function createWindow() {
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
    // 创建浏览器窗口。

    // 在此处进行后台服务的启动[java]
    restartTimer = setInterval(() => {
        restartJava({ servicePath, emitor: win.webContents });
    }, RESTART_TIME_INTERVAL);

    // win.setMenu(null);

    // 加载index.html文件
    win.loadFile('build_web/index.html');

    // 打开开发者工具
    // win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    });

    win.on('maximize', () => {
        process_emiter('win-max', true);
    });

    win.on('unmaximize', () => {
        process_emiter('win-max', false);
    });

    /**
     * 监听最大化、最小化、关闭操作
     */
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
        {
            label: '重启服务[DEV]',
            click: function () {
                win.show();
                restartJava({ servicePath, emitor: win.webContents, firstTime: 1 });
            }
        },
        {
            label: '开发工具[DEV]',
            // icon: path.join(__dirname, './icons/udpate16.png'),
            click: function () {
                win.show();
                win.webContents.openDevTools();
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
        // 当运行第二个实例时,将会聚焦到win这个窗口
        if (win) {
            if (win.isMinimized()) win.restore();

            win.show();
        }
    })
}
// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        // 此处需要停止java服务restart 操作

        clearInterval(restartTimer);
        app.quit()
    }
});

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
    }
});

