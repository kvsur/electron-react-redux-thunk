/**
 * Created by kvsur at today
 * 主进程处理上课下课的检测操作
 */
class Schedule {
    constructor(ipcMain, win) {
        this.ipcMain = ipcMain;
        this.win = win;
        this.timer = null;
        this.initTimer = null;
        this.init();
    }

    init() {
        // 特殊处理 从后端获取到作息表之后的的处理，如果未到上课时间，用户关闭了客户端，到时间需要弹出客户端
        this.ipcMain.on('init-class', (_event, timeout) => {
            this.initTimer = setTimeout(() => {
                clearTimeout(this.initTimer);
                this.win.webContents.send('process_event', 'init-class');
            }, timeout);
        });

        this.ipcMain.on('init-class-response', (_event, inLoginPage) => {
            if (inLoginPage) {
                this.win.show();
                global.isAppHide = false;
            }
        });

        this.ipcMain.on('class-start', (_event, timeout) => {
            this.handle(timeout);
        });

        this.ipcMain.on('class-end', (_event, timeout) => {
            this.handle(timeout, 'class-end');
        });

        this.ipcMain.on('class-delay', (_event, timeout) => {
            this.handle(timeout);
        });
    }

    handle(timeout, isEnd) {
        console.log(timeout);
        this.win.hide();
        global.isAppHide = true;
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.win.webContents.send('process_event', isEnd ? 'class-will-start' : 'class-will-end');
            this.win.show();
            global.isAppHide = false;
        }, timeout);
    }
}

module.exports = Schedule;
