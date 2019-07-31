const path = require('path');

module.exports = {
    icon: path.join(__dirname, '../build_web/favicon.ico'),
    width: 600,
    minWidth: 600,
    height: 450,
    minHeight: 450,
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
        nodeIntegration: false, // 不集成 Nodejs
        webSecurity: false,
        preload: path.join(__dirname, './renderer.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
};
