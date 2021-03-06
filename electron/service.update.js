/**
 * Created by LeeCH at August 1st, 2019 7:01pm
 * This module is *** deprecated *** because update service instead of client installer, no longer user runtime.
 */
const fs = require('fs');
const exec = require('child_process').execSync;
const execFile = require('child_process').execFileSync;
const decompress = require('decompress');
const decompressUnzip = require('decompress-unzip');
const { JAVA_SERVER_ROOT_NAME, JAVA_JDK_ROOT_NAME } = require('./constant');
const removeDir = require('./removeDir');

async function isVersionNotEqual(updateJsonFilePath, version, dialog) {
    try {
        const serviceUpdateFile = await fs.readFileSync(updateJsonFilePath).toString();
        const { version: oldVersion } = JSON.parse(serviceUpdateFile);
        return Promise.resolve(version !== oldVersion);
    } catch (e) {
        return Promise.resolve(true);
    }
}


async function updateJavaService({ rootPath, dialog, userDataPath, appPath, version, needUpdateNow }) {
    try {
        const servicePath = `${rootPath}\\${JAVA_SERVER_ROOT_NAME}`;
        const serviceStopBat = `${servicePath}\\bin\\stop.bat`;
        if (await fs.existsSync(serviceStopBat)) {
            await execFile(serviceStopBat);
        }

        const updateJsonFilePath = `${rootPath}\\service_update.json`;
        const versionNotEqual = await isVersionNotEqual(updateJsonFilePath, version, dialog);
        if (versionNotEqual && needUpdateNow) {
            const JDK = `${appPath}\\jar\\${JAVA_JDK_ROOT_NAME}.zip`;
            const JDKExist = await fs.existsSync(JDK);
            const service = `${appPath}\\jar\\${JAVA_SERVER_ROOT_NAME}.zip`;
            const serviceExist = await fs.existsSync(service);
            if (JDKExist) {
                const jdkPath = `${rootPath}\\${JAVA_JDK_ROOT_NAME}`;
                if (await fs.existsSync(`${jdkPath}.zip`)) {
                    await fs.unlinkSync(`${jdkPath}.zip`);
                }
                await exec(`xcopy ${JDK} ${rootPath} /E`);
                if (await fs.existsSync(jdkPath)) {
                    await removeDir(jdkPath);
                }
                await decompress(`${jdkPath}.zip`, `${rootPath}`, { plugins: [decompressUnzip()] });
                await fs.unlinkSync(`${jdkPath}.zip`);
                await fs.unlinkSync(JDK);
            }
            if (serviceExist) {
                if (await fs.existsSync(`${servicePath}.zip`)) {
                    await fs.unlinkSync(`${servicePath}.zip`);
                }
                await exec(`xcopy ${service} ${rootPath} /E`);
                if (await fs.existsSync(servicePath)) {
                    await removeDir(servicePath);
                }
                await decompress(`${servicePath}.zip`, `${rootPath}`, { plugins: [decompressUnzip()] });
                await fs.unlinkSync(`${servicePath}.zip`);
                await fs.unlinkSync(service);
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
