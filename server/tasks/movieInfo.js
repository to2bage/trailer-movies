const puppeteer = require("puppeteer");
const movielisturl = `https://movie.douban.com/tag/#/`;
// https://movie.douban.com/subject/豆瓣id
const movieDetailBase = `https://movie.douban.com/subject/`
// const movieInfo = [];

const sleep = (t) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, t);
    })
}
// 获取电影详细内容和预告片
const getMovieDetailAndTrailer = async (browser, doubanID) => {
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
            let picAddr = ""; // 封面图的图片地址
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
        })
    }

    const data = {
        doubanID,
        video,
        cover: result.picAddr
    }
    return data;
}
// 获取电影列表的数据
const getMovieListInfo = (browser) => {
    let items = document.querySelectorAll(".list-wp a");
    let links = []

    items.forEach(item => {
        let doubanId = item.querySelector(".cover-wp").getAttribute("data-id");
        let title = item.querySelector(".title").innerHTML;
        let rate = Number(item.querySelector(".rate").innerHTML);
        let poster = item.getElementsByTagName("img")[0].getAttribute("src");

        // 继续获得这个电影的详细内容和预告片
        let result = {};
        // let result = getMovieDetailAndTrailer(browser, doubanId);



        links.push({
            doubanId,
            title,
            rate,
            poster,
            tailerCover: result.cover,
            tailer: result.video
        })
    })
    return links;
}

;(async () => {
    console.log("开始爬取网页了欧...");
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        dumpio: false
    })
    const page = await browser.newPage();
    await sleep(3000);
    await page.goto(movielisturl, {
        waitUntil:"networkidle2"
    })
    await sleep(3000);

    const movieInfos = await page.evaluate(() => {
        // let infos = getMovieListInfo(browser);
        // return infos;
        //
        let items = document.querySelectorAll(".list-wp a");
        let links = []

        items.forEach( async (item) => {
            let doubanId = item.querySelector(".cover-wp").getAttribute("data-id");
            let title = item.querySelector(".title").innerHTML;
            let rate = Number(item.querySelector(".rate").innerHTML);
            let poster = item.getElementsByTagName("img")[0].getAttribute("src");

            // 继续获得这个电影的详细内容和预告片
            // let result = {};
            // let result = getMovieDetailAndTrailer(browser, doubanId);
            //
            //
            //
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
                    let picAddr = ""; // 封面图的图片地址
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
                })
            }

            const data = {
                doubanID,
                video,
                cover: result.picAddr
            }
            // return data;
            //
            //
            //
            //
            //
            //
            links.push({
                doubanId,
                title,
                rate,
                poster,
                data,
                tailerCover: result.cover,
                tailer: result.video
            })
        })
        return links;
    })

    browser.close();
    // console.log(infos);
    console.log(movieInfos);
})()