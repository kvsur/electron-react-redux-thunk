const path = require('path');

module.exports = {
    icon: path.join(__dirname, '../build_web/favicon.ico'),
    width: 315,
    minWidth: 315,
    maxWidth: 315,
    height: 360,
    minHeight: 360,
    maxHeight: 511,
    // resizable: false,
    title: '智能语音录课助手',
    center: true,
    titleBarStyle: 'hidden',
    zoomToPageWidth: true,
    frame: false,
    skipTaskbar: false,
    // show: false,
    webPreferences: {
        devTools: true,
        javascript: true,
        plugins: true,
        nodeIntegration: false, // Do not integration Nodejs into client
        webSecurity: false,
        preload: path.join(__dirname, './renderer.js') // preload js file can use NodeJs API normally
    }
};
