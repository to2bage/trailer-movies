const puppeteer = require("puppeteer");
// 3168101: doubanID
const url = `https://movie.douban.com/subject/3168101/`;
const base = `https://movie.douban.com/subject/`
const doubanID = `3168101`;
// 238802: 视频详情页的ID
const videoBase = `https://movie.douban.com/trailer/238802/#content`;

const sleep = time => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    })
};

;(async () => {
    console.log("开始爬取电影的预告片呢哦...");
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        dumpio: false
    })
    const page = await browser.newPage();
    await page.goto(base + doubanID, {
        waitUntil: "networkidle2"
    })
    await sleep(2000);
    const result = await page.evaluate(() => {
        let aDom = document.querySelector(".related-pic-video");
        if (aDom) {
            // 获得预告片的视频地址页面
            let link = aDom.getAttribute("href");
            // 获得预告片的封面图
            let styleStr = aDom.getAttribute("style");
            let picAddr = "";           // 封面图的图片地址
            let idx = styleStr.indexOf("(");
            let lidx = styleStr.indexOf("?");
            for (let i = idx + 1; i < lidx; i++) {
                picAddr += styleStr[i];
            }
            return {
                link,
                picAddr
            }
        }
        return {}
    })
    // 继续爬取电影的预告片地址
    let video = "";
    if (result.link) {
        await page.goto(result.link, {
            waitUntil: "networkidle2"
        });
        await sleep(2000);
        video = await page.evaluate(() => {
            let vDom = document.getElementsByTagName("source")[0];
            if (vDom) {
                return vDom.getAttribute("src");
            }
            return "";
            //
            // var $ = window.$
            // var it = $("source")
            // if (it && it.length > 0) {
            //     return it.attr("src");
            // }
            // return "";
        })
    }

    const data = {
        doubanID,
        video,
        cover: result.picAddr
    }
    // console.log(data);          // for test
    browser.close();
    process.send({data});
    process.exit(0);
})();