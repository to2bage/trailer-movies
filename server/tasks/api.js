// https://api.douban.com/v2/movie/subject/:id
// 以下代码实现对当个豆瓣电影doubanId, 获取其详细内容
const reqP = require("request-promise-native");

async function fetchMovie(item) {
    const url = `https://api.douban.com/v2/movie/subject/${item.doubanId}`;
    try {
        const res = await reqP(url);
        return res;
    } catch (err) {
        console.log(err);
    }
    
}

;(async () => {
    let movies = [
        {
            doubanId: '3541415',
            title: '盗梦空间',
            rate: 9.3,
            poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p513344864.jpg'
        }, {
            doubanId: '27615441',
            title: '网络谜踪',
            rate: 8.5,
            poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2541019743.jpg'
        }
    ];  // 实验用的数据

    movies.map(async movie => {
        let movieData = await fetchMovie(movie);
        try {
            movieData = await JSON.parse(movieData);
            console.log(movieData);
        } catch (err) {
            console.log(err);
        }
    });
})();