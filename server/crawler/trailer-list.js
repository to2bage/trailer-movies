const puppeteer = require("puppeteer");
const url = `https://movie.douban.com/tag/#/`;

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}

;(async () => {
    console.log("开始爬取豆瓣啦...");
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle0'
    });
    await sleep(3000);
    await page.waitForSelector(".more");
    for (let i = 0; i < 1; i++) {
        await sleep(3000);
        await page.click(".more");
    }

    const result = await page.evaluate(() => {
        //#region jquer
        // var $ = window.$;
        // var items = $(".list-wp a");
        // var links = [];

        // if (items.length >= 1) {
        //     items.each((index, item) => {
        //         let it = $(item);
        //         let doubanId = it.find("div").data("id");
        //         let title = it.find("title").text();
        //         let rate = Number(it.find(".rate").text());
        //         let poster = it.find("img").attr("src");

        //         links.push({
        //             doubanId,
        //             title,
        //             rate,
        //             poster
        //         })
        //     })
        // }
        // return links;
        //#endregion
        //#region document
        let items = document.querySelectorAll(".list-wp a");
        let links = [];

        items.forEach(item => {
            let doubanId = item.querySelector(".cover-wp").getAttribute("data-id");
            let title = item.querySelector(".title").innerHTML;
            let rate = Number(item.querySelector(".rate").innerHTML);
            let poster = item.getElementsByTagName("img")[0].getAttribute("src");

            links.push({
                doubanId,
                title,
                rate,
                poster
            })
        })
        return links;
        //#endregion
    });
    browser.close();
    // console.log(result);
    process.send({
        result
    })
    process.exit(0);
})()