const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const staticServ = require("koa-static");
const artTmpl = require("koa-art-template");
const mongoose = require("mongoose");
const { resolve } = require("path");
const { connect, initSchemas } = require("./database/init.js");

// 建立与数据库的连接
;(async () => {
    await connect();
    initSchemas();
    // 以下是测试
    const Movie = mongoose.model("Movie");
    const movies = await Movie.find({});
    console.log(movies);
})();

const app = new Koa();
const router = new Router();

artTmpl(app, {
    root: resolve(__dirname, './views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
})

app.use(bodyParser());

router.get("/", async (ctx, next) => {
    await ctx.render("index")
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8964, "127.0.0.1", () => {
    console.log('App listening on port 8964!');
});