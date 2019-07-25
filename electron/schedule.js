/**
 * Created by kvsur at today
 * 主进程处理上课下课的检测操作
 */
class Schedule {
    constructor(ipcMain, win) {
        this.ipcMain = ipcMain;
        this.win = win;
        this.timer = null;
        this.init();
    }

    init() {
         this.ipcMain.on('class-start', (event, timeout) => {
            this.handle(timeout);
        });

         this.ipcMain.on('class-end', (event, timeout) => {
            this.handle(timeout, 'class-end');
        });

         this.ipcMain.on('class-delay', (event, timeout) => {
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
        }, timeout * 60 * 1000);
    }
}

module.exports = Schedule;
