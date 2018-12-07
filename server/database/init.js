const mongoose = require("mongoose");
const glob = require("glob");
const { resolve } = require("path");
const url = `mongodb://47.91.156.189:27017/douban-trailer`
mongoose.Promise = global.Promise;

exports.connect = () => {
    let curConnectionTimes = 0;
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== "production") {
            mongoose.set("debug", true);
        }
        mongoose.connect(url, {
            useNewUrlParser: true
        });

        mongoose.connection.on("disconnected", () => {
            curConnectionTimes++;
            if (curConnectionTimes < 5) {
                mongoose.connect(url, {
                    useNewUrlParser: true
                });
            } else {
                throw new Error("连接数据库次数太多了...");
            }
        })

        mongoose.connection.on("error", (err) => {
            curConnectionTimes++;
            if (curConnectionTimes < 5) {
                mongoose.connect(url, {
                    useNewUrlParser: true
                })
            } else {
                console.error(err);
                throw new Error(err);
            }
        })

        mongoose.connection.once("open", (db) => {
            console.log("~~~数据库连接成功~~~")
            resolve("数据库连接成功")
        })
    })
}

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, "./schema/", "**/*.js")).forEach(ele => {
        require(ele);
    });
};
