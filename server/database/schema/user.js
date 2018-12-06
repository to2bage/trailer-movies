const mongoose = require("mongoose");
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;       // 尝试登录的次数
const LOCK_TIME = 2 * 60 * 60 * 1000;   // 锁定账户的时长

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    lockUntil: Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now(),
        }
    }
});
// 定义mongoose的虚拟字段
userSchema.virtual("isLocked").get(() => {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// 在保存之前, 会执行回调函数
userSchema.pre("save", (next) => {
    if (this.isNew) {
        // 当前的实体数据, 是否是新的
        this.meta.createAt = Date.now();
        this.meta.updateAt = Date.now();
    } else {
        // 如果不是新的数据
        this.meta.updateAt = Date.now();
    }
    next();
});

userSchema.pre("save", next => {
     // 如果当前数据的密码值没有被更改的话
     if (!this.isModified("password")) return next();
     // 否则的话
     bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
         if (err) return next(err);
         bcrypt.hash(this.password, salt, (err, hash) => {
             if (err) return next(err);
             this.password = hash;
             next();
         })
     });
     next();    // 写不写无所谓的
});

userSchema.methods = {
    // pwd1是用户输入的, pwd2是保存在数据库中加过盐的密码的hash
    comparePassword: (pwd1, pwd2) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(pwd1, pwd2, (err, isMatch) => {
                if (err) reject(err);
                resolve(isMatch);
            })
        });
    },
    incLoginAttempts: (user) => {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        isLocked: 1
                    }
                }, (err) => {
                    if (!err) resolve(true);
                    else reject(err);
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }
            }
        })
    },
};

module.exports.User = mongoose.model("User", userSchema);