const mongoose = require("mongoose");
const childProcess = require("child_process");
const { resolve } = require("path");
// const { Movie } = require("../database/schema/movie.js");
const Movie = mongoose.model("Movie");

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
        // console.log(result);
        // 存入数据库
        result.forEach(async item => {
            // 判断当前的doubanId是否被存储过
            let movie = await Movie.findOne({doubanId: item.doubanId})
            if (!movie) {
                // 如果该doubanId没有被存过, 就创建一条数据
                movie = new Movie(item);
                await movie.save();
            }
        });
    })
})();


/*
    [
        {
            doubanId: '27110296',
            title: '无名之辈',
            rate: 8.2,
            poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2539661066.jpg'
        },
        {
            doubanId: '3168101',
            title: '毒液：致命守护者',
            rate: 7.3,
            poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2537158013.jpg'
        },
        {
            doubanId: '27605698',
            title: '西虹市首富',
            rate: 6.6,
            poster: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529206747.jpg'
        },
    ]    
*/