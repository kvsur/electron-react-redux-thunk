const fs = require('fs');
const exec = require('child_process').exec;
// const path = require('path');


async function updateJavaService(emiter, userDataPath, appPath, version, needUpate) {
    // update file or exec update-service opration: ${userDataPath}/service_update.json
    try {
        const fileExist = await fs.existsSync(`${userDataPath}/service_update.json`);
        if (fileExist && !needUpate) {
            const serviceUpdateFile = await fs.readFileSync(`${userDataPath}/service_update.json`).toString();
            const { update } = JSON.parse(serviceUpdateFile);
            if (update) {
                const jarExist = await fs.existsSync(`${appPath}/jar/restart.bat`);
                if (jarExist) {
                    await fs.copyFileSync(`${appPath}/jar/restart.bat`, `${userDataPath}/restart.bat`);
                    exec(`${userDataPath}/restart.bat test_demo`, async (err, res) => {
                        if (!err) {
                            emiter.send('process_event', 'service-tip', {type: 'info', message: res});
                        }else {
                            emiter.send('process_event', 'service-tip', {type: 'error', message: err.message});
                        }
                        await fs.writeFileSync(`${userDataPath}/service_update.json`, `{"version": "${version}", "update": ${needUpate}}`);
                        return Promise.resolve();
                    });
                }
            }
        }
        await fs.writeFileSync(`${userDataPath}/service_update.json`, `{"version": "${version}", "update": ${needUpate}}`);
        return Promise.resolve();
    } catch(e) {
        emiter.send('process_event', 'service-tip', {type: 'error', message: e.message || e.toString()});
        return Promise.resolve();
    }
}

module.exports = updateJavaService;
