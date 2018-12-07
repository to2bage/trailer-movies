const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true        // 分类名称, 不允许重复
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"        // 建立指向关系, 指向model名称为Movie的数据
    }],
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
});

categorySchema.pre("save", function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }
    next();
})

module.exports.Category = mongoose.model("Category", categorySchema);