/**
 * Created by LeeCH at August 27th, 2019 10:27am
 */
const WinReg = require('winreg');

class Boot {
    static enableAutoStart({ name, file }, callback) {
        var key = getKey();
        key.set(name, WinReg.REG_SZ, file, callback || noop);
    }

    static disableAutoStart({ name }, callback) {
        var key = getKey();
        key.remove(name, callback || noop);
    }

    static getAutoStartValue({ name }, callback) {
        var key = getKey();
        key.get(name, function (error, result) {
            if (result) {
                callback(null, result.value);
            } else {
                callback(error);
            }
        })
    }
}

var RUN_LOCATION = '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';

// Get regedit key 
function getKey() {
    return new WinReg({
        hive: WinReg.HKCU, // CurrentUser,
        // hive: WinReg.HKLM, // root 
        key: RUN_LOCATION,
    })
}

// callback, you code here 
function noop() {

}

// 导出
module.exports = Boot;