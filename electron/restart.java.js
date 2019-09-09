/**
 * Created by LeeCH at August 21st, 2019 3:03pm
 */
const exec = require('child_process').execFile;
const fs = require('fs');
const { RESTART_JAVA_BASH_PATH } = require('./constant');

module.exports = async function ({servicePath, emiter, firstTime}) {
    if (firstTime) console.log('--------------------firstTime----------------');
    else {
        console.log('restart by timer');
    }
    const bashPath = `${servicePath}\\${RESTART_JAVA_BASH_PATH}`;
    const date = new Date().toLocaleString('zh-CN', { hour12: false });
    const cwd = `${servicePath}\\bin`;
    try {
        // service-log
        emiter && emiter.send('process_event', 'service-log', { bashPath, date });

        // If this restart batch file exists
        const bashExist = await fs.existsSync(bashPath);
        if (bashExist) {
            exec(bashPath, null, { cwd }, (err, res) => {
                if (err) {
                    throw new Error('执行服务重启脚本失败' + err.message);
                }else {
                    console.log('--------------------restart java service success----------------');
                    emiter && emiter.send('process_event', 'service-log', '--------------------restart java service success----------------');
                }
            });
        } else {
            throw new Error(`java服务重启脚本不存在:${bashPath}`);
        }
    } catch (e) {
        // Show error log to client UI devtool
        emiter && emiter.send('process_event', 'service-log', { message: e.message || e.toString(), bashPath, date });
    } finally {
        return Promise.resolve();
    }
}