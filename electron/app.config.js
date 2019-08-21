const path = require('path');

const iconPath = process.env.APP_PLATFORM === 'win' ? '../build_web/favicon.ico' : '../build_web/favicon.icns';

console.log(iconPath);

module.exports = {
    icon: path.join(__dirname, iconPath),
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
        nodeIntegration: false, // 不集成 Nodejs
        webSecurity: false,
        preload: path.join(__dirname, './renderer.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
};
