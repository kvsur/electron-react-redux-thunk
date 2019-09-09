/**
 * Created by LeeCH at August 27th, 2019 10:26am
 */
const fs = require('fs');

async function removeDir(path) {
    try {
        let files = [];
        if (await fs.existsSync(path)) {
            files = await fs.readdirSync(path);
            files.forEach(async (file, index) => {
                let curPath = path + "/" + file;
                if ((await fs.statSync(curPath)).isDirectory()) {
                    await removeDir(curPath); // remove directory recursively
                } else {
                    await fs.unlinkSync(curPath); // remove file 
                }
            });
            await fs.rmdirSync(path);
        }
    } catch(e) {

    } finally {
        return Promise.resolve();
    }
}

module.exports = removeDir;
