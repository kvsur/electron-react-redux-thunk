const { app, BrowserWindow, Tray, nativeImage, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron');
const path = require('path');
const appConfig = require('./app.config');
const Schedule = require('./schedule');

const feedOption = {
    // "provider": "znkf",
    "url": 'http://172.19.80.224/packages/docker_images/teaching_package/'
};

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win;
let tray;

function updateHandle() {
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };
    const os = require('os');

    autoUpdater.setFeedURL(feedOption.url);
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        win.webContents.send('process_event', 'download-progress', progressObj)
    })
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

        ipcMain.on('update-now', (e, arg) => {
            console.log(arguments);
            console.log("开始更新");
            // 更新之前需要做的事情放在这儿
            autoUpdater.quitAndInstall();
        });

        win.webContents.send('process_event', 'update-now')
    });

    ipcMain.on("check-update", () => {
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    win.webContents.send('process_event', 'udpate-message', text)
}

function createWindow() {
    tray = new Tray(path.join(__dirname, '../build_web/favicon.ico'));
    // 创建浏览器窗口。
    win = new BrowserWindow({ ...appConfig });

    // win.setMenu(null);

    // 加载index.html文件
    win.loadFile('build_web/index.html');

    // 打开开发者工具
    win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    });

    win.on('maximize', () => {
        win.webContents.send('process_event', 'win-max', true);
    });

    win.on('unmaximize', () => {
        win.webContents.send('process_event', 'win-max', false);
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

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出',
            click: function () {
                app.quit();
            }
        }
    ]);
    tray.setToolTip('教育语音分析系统');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (global.isAppHide || win.isMinimized()) {
            win.show();
            global.isAppHide = false;
            // win.webContents.send('process_event', 'classStart', {});
            win.webContents.send('process_event', 'tray-click', { a: 12 });
        }
    });

    // setTimeout(() => {
    //     win.show();
    // }, 10000);

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
            win.focus();
            win.show();
        }
    })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
    }
});

