// 爬取豆瓣电影的预告片地址
const childProcess = require("child_process");
const { resolve } = require("path");

;(async () => {
    const script = resolve(__dirname, "../crawler/video.js");

    const cp = childProcess.fork(script, []);

    cp.on("message", (obj) => {
        console.log(obj.data);
    })

    cp.on("close", code => {
        console.log(code);
    })
})();