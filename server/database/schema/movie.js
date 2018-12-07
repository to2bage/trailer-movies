const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
    doubanId: {
        type: String        // 豆瓣ID
    },
    category: {             // 电影所属的分类
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    rate: Number,           // 豆瓣评分
    title: String,          // 电影的名字
    summary: String,        // 电影简介
    video: String,          // 预告片地址
    poster: String,         // 电影海报地址
    cover: String,          // 预告片封面图地址
    videoKey: String,       // 预告片在图床上的地址
    postKey: String,        // 电影海报在图床上的地址
    coverKey: String,       // 预告片封面图在图床上的地址
    rawTitle: String,       // 英文标题
    movieTypes: [String],   // 电影的类别: 字符串数组
    pubdate: mongoose.Schema.Types.Mixed,  // 上映日期: Mixed类型表示可以存储任何类型的数据
    year: Number,           // 上映年份
    tags: Array,            // 电影标签
    meta: {
        createdAt: {
            type: Date,     // 这条数据的创建的日期
            default: Date.now()
        },
        updatedAt: {
            type: Date,     // 这条数据的更新的日期
            default: Date.now()
        }
    }
});

movieSchema.pre("save", next => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }
    next();
})

module.exports.Movie = mongoose.model("Movie", movieSchema);