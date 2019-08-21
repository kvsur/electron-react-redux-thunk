const exec = require('child_process').execFile;
const fs = require('fs');
const { RESTART_JAVA_BASH_PATH } = require('./constant');

module.exports = async function (rootPath, emiter) {
    const bashPath = `${rootPath}\\${RESTART_JAVA_BASH_PATH}`;
    const date = new Date().toLocaleString('zh-CN', { hour12: false });
    const cwd = `${rootPath}\\bin`;
    try {
        // service-log
        emiter.send('process_event', 'service-log', { bashPath, date });

        // 判断服务重启脚本是否存在
        const bashExist = await fs.existsSync(bashPath);
        if (bashExist) {
            exec(bashPath, null, { cwd }, (err, res) => {
                if (err) {
                    throw new Error('执行服务重启脚本失败');
                } else {
                    // emiter.send('process_event', 'service-tip', {type: 'info', message: '服务重启成功' + res.toString()});
                }
            });
            // console.log(`${rootPath}\\bin`);
        } else {
            throw new Error(`java服务重启脚本不存在:${bashPath}`);
        }
    } catch (e) {
        // 向客户端界面提示信息
        // emiter.send('process_event', 'service-tip', {type: 'error', message: e.message || e.toString()});
        emiter.send('process_event', 'service-log', { message: e.message || e.toString(), bashPath, date });
    } finally {
        // 不影响接下来操作的执行，直接resolve 'undefined'
        return Promise.resolve();
    }
}