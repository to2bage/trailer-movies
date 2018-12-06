const childProcess = require("child_process");
const { resolve } = require("path");

;(async () => {
    const script = resolve(__dirname, "../crawler/trailer-list.js");
    const child = childProcess.fork(script, []);

    let invoke = false;     // 表示脚本script是否被调用过
    child.on("error", err => {
        if (invoke) return;
        invoke = true;
        console.log(err)
    });
    child.on("exit", code => {
        if (invoke) return;
        invoke = true;
        let err = code === 0 ? "null" : new Error("Exit Code: " + code);
        console.log(err);
    });
    child.on("message", data => {
        let result = data.result;
        console.log(result);
    })
})();