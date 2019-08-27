const fs = require('fs');
const exec = require('child_process').execSync;
const execFile = require('child_process').execFileSync;
// const exec = require('child_process').exec;
const decompress = require('decompress');
const decompressUnzip = require('decompress-unzip');
const { JAVA_SERVER_ROOT_NAME, JAVA_JDK_ROOT_NAME } = require('./constant');
const removeDir = require('./removeDir');
// const path = require('path');

async function isVersionNotEqual(updateJsonFilePath, version, dialog) {
    try {
        const serviceUpdateFile = await fs.readFileSync(updateJsonFilePath).toString();
        // dialog.showMessageBox({
        //     message: serviceUpdateFile
        // });
        const { version: oldVersion } = JSON.parse(serviceUpdateFile);
        return Promise.resolve(version !== oldVersion);
    } catch (e) {
        // 不存在文件时会抛错
        return Promise.resolve(true);
    }
}


async function updateJavaService({ rootPath, dialog, userDataPath, appPath, version, needUpdateNow }) {
    // update file or exec update-service opration: ${userDataPath}\service_update.json
    try {
        const servicePath = `${rootPath}\\${JAVA_SERVER_ROOT_NAME}`;
        const serviceStopBat = `${servicePath}\\bin\\stop.bat`;
        if (await fs.existsSync(serviceStopBat)) {
            await execFile(serviceStopBat);
        }

        const updateJsonFilePath = `${userDataPath}\\service_update.json`;
        const versionNotEqual = await isVersionNotEqual(updateJsonFilePath, version, dialog);
        if (versionNotEqual && needUpdateNow) {
            const JDK = `${appPath}\\jar\\${JAVA_JDK_ROOT_NAME}.zip`;
            const JDKExist = await fs.existsSync(JDK);
            const service = `${appPath}\\jar\\${JAVA_SERVER_ROOT_NAME}.zip`;
            const serviceExist = await fs.existsSync(service);
            if (JDKExist) {
                // await fs.copyFileSync(JDK, rootPath);
                await exec(`xcopy ${JDK} ${rootPath} /E`);
                const jdkPath = `${rootPath}\\${JAVA_JDK_ROOT_NAME}`;
                if (await fs.existsSync(jdkPath)) {
                    // await fs.rmdirSync(jdkPath);
                    await removeDir(jdkPath);
                }
                await decompress(`${jdkPath}.zip`, `${rootPath}`, { plugins: [decompressUnzip()] });
                await fs.unlinkSync(`${jdkPath}.zip`);
                // await fs.unlinkSync(JDK);
            }
            if (serviceExist) {
                // await fs.copyFileSync(service, rootPath);
                await exec(`xcopy ${service} ${rootPath} /E`);
                if (await fs.existsSync(servicePath)) {
                    // await fs.rmdirSync(servicePath);
                    await removeDir(servicePath);
                }
                await decompress(`${servicePath}.zip`, `${rootPath}`, { plugins: [decompressUnzip()] });
                await fs.unlinkSync(`${servicePath}.zip`);
                // await fs.unlinkSync(service);
            }
        }
        await fs.writeFileSync(updateJsonFilePath, `{"version": "${version}", "update": ${needUpdateNow}}`);
        return Promise.resolve();
    } catch (e) {
        // emiter.send('process_event', 'service-log', { type: 'error', message: e.message || e.toString() });
        dialog.showMessageBox({
            message: e.message || e.toString()
        });
        return Promise.resolve();
    }
}

module.exports = updateJavaService;
