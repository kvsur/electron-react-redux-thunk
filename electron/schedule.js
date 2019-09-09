/**
 * Created by LeeCH at July 25th, 2019 1:37pm
 * 
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
            this.handle(timeout, 'class-start');
        });

        this.ipcMain.on('class-end', (_event, timeout) => {
            this.handle(timeout, 'class-end');
        });

        this.ipcMain.on('class-delay', (_event, timeout) => {
            this.handle(timeout, 'class-delay');
        });
    }

    handle(timeout, action) {
        this.win.webContents.send('process_event', 'service-log', {action, timeout});
        // console.log(timeout);
        this.win.hide();
        global.isAppHide = true;
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.win.webContents.send('process_event', action === 'class-end' ? 'class-will-start' : 'class-will-end');
            this.win.show();
            global.isAppHide = false;
        }, timeout);
    }
}

module.exports = Schedule;
