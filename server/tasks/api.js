// https://api.douban.com/v2/movie/subject/:id
// 以下代码实现对当个豆瓣电影doubanId, 获取其详细内容
const reqP = require("request-promise-native");
const mongoose = require("mongoose");
const Movie = mongoose.model("Movie");
const Category = mongoose.model("Category");

async function fetchMovie(item) {
    const url = `https://api.douban.com/v2/movie/subject/${item.doubanId}`;
    const res = await reqP(url);
    // console.log(res);
    let body = null;
    try {
        body = await JSON.parse(res);
        // console.log("==> ",body);
    } catch (err) {
        console.log(err);
    }
    return body;
}

;(async () => {
    // let movies = [
    //     {
    //         doubanId: '3541415',
    //         title: '盗梦空间',
    //         rate: 9.3,
    //         poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p513344864.jpg'
    //     }, {
    //         doubanId: '27615441',
    //         title: '网络谜踪',
    //         rate: 8.5,
    //         poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2541019743.jpg'
    //     }
    // ];  // 实验用的数据

    let movies = await Movie.find({
        $or: [
            { summary: {$exists: false}},
            { summary: null},
            { summary: ''},
            { title: ''}
        ]
    });

    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        // 根据doubanId获得API提供的电影数据
        let movieData = await fetchMovie(movie);
        if (movieData) {
            movie.tags = movieData.aka || [];
            movie.summary = movieData.summary || '';
            movie.title = movieData.title || '';
            movie.rawTitle = movieData.original_title || movieData.title || '';
            movie.year = movieData.year || '';
            movie.pubdate = movieData.year || '';
            movie.movieTypes = movieData.genres || [];

            // 便利movie.movieTypes, 以便与Category表连接
            for (let i = 0; i < movie.movieTypes.length; i++) {
                let item = movie.movieTypes[i];
                let cat = await Category.findOne({name: item})
                // 如果category中没有item这条记录, 
                if (!cat) {
                    // 如果, Category没有存储过
                    cat = new Category({
                        name: item,
                        movies: [movie._id]
                    })
                } else {
                    // 如果存储过, 再查看category中是否保存过这部电影
                    if (cat.movies.indexOf(movie._id) === -1) {
                        // category中没有保存过
                        cat.movies.push(movie._id);
                    }
                }
                await cat.save();
                if (!movie.category) {
                    // 如果当前movie表中点category数组是为空的
                    movie.category.push(cat._id);
                } else {
                    if (movie.category.indexOf(cat._id) === -1) {
                        movie.category.push(cat._id);
                    }
                }
            }
            await movie.save();
        }
    }
})();