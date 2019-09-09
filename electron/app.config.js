const path = require('path');

module.exports = {
    icon: path.join(__dirname, '../build_web/favicon.ico'),
    width: 600,
    minWidth: 600,
    // maxWidth: 600,
    height: 430,
    minHeight: 430,
    // maxHeight: 450,
    // resizable: false,
    title: '教育语音分析系统',
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
