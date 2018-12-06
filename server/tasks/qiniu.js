const qiniu = require("qiniu");
const nanoid = require("nanoid");
const config = require("../config/index.js");

const bucket = config.qiniu.bucket;
const mac = new qiniu.auth.digest.Mac(config.qiniu.Ak, config.qiniu.SK);
const cfg = new qiniu.conf.Config();
const client = new qiniu.rs.BucketManager(mac, cfg);

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err);
            } else {
                if (info.statusCode === 200) {
                    resolve({key});
                } else {
                    reject(info);
                }
            }
        });
    });
};

;(async () => {
    let movies = [{
        doubanID: '3168101',
        video: 'http://vt1.doubanio.com/201812061558/63493a82b4d9ff24251bf34d8dd7058f/view/movie/M/402380802.mp4',
        cover: 'https://img3.doubanio.com/img/trailer/medium/2538953624.jpg',
        poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2537158013.jpg'
    }];

    movies.map(async movie => {
        if (movie.video && !movie.key) {
            try {
                console.log("开始传VIDEO");
                let videoData = await uploadToQiniu(movie.video, nanoid() + ".mp4");
                console.log("开始传Cover")
                let coverData = await uploadToQiniu(movie.cover, nanoid() + ".jpg");
                console.log("开始传Poster");
                let posterData = await uploadToQiniu(movie.poster, nanoid() + ".jpg");

                if (videoData.key) {
                    movie.videoKey = videoData.key;
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key;
                }
                if (posterData.key) {
                    movie.posterKey = posterData.key;
                }

                console.log(movie);
            } catch (err) {
                console.log(err);
            }
        }
    })
})();

// {
//     doubanID: '3168101',
//     video: 'http://vt1.doubanio.com/201812061558/63493a82b4d9ff24251bf34d8dd7058f/view/movie/M/402380802.mp4',
//     cover: 'https://img3.doubanio.com/img/trailer/medium/2538953624.jpg',
//     poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2537158013.jpg',
//     videoKey: 'QLM1-GO_UT05mpeYIWWF3.mp4',
//     coverKey: 'LUyrHPojMRnD-C28LSyLk.jpg',
//     posterKey: 'XueGqQcyo80zKeuwosWMk.jpg'
// }

// http://pjb2hpvdr.bkt.clouddn.com/QLM1-GO_UT05mpeYIWWF3.mp4