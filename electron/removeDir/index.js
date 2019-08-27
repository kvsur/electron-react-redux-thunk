const fs = require('fs');

async function removeDir(path) {
    try {
        let files = [];
        if (await fs.existsSync(path)) {
            files = await fs.readdirSync(path);
            files.forEach(async (file, index) => {
                let curPath = path + "/" + file;
                if ((await fs.statSync(curPath)).isDirectory()) {
                    await removeDir(curPath); //递归删除文件夹
                } else {
                    await fs.unlinkSync(curPath); //删除文件
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
