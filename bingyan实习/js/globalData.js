// fetch('http://127.0.0.1:23330/lyric')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('请求失败，状态码：' + response.status);
//         }
//         return response.text();  // 仍然使用 text() 获取原始响应
//     })
//     .then(data => {
//         console.log('返回内容:', data);
//     })
//     .catch(error => {
//         console.error('请求出错:', error);
//     });


// const data = {
//     "music0": {
//         "id": "0",
//         "lrc": "E:\\vscode前端\\bingyan实习\\music\\lrc\\0.lrc",
//         "mp3": "E:\\scode前端\\bingyan实习\\music\\mp3\\0.mp3"
//     },
//     "music1": {
//         "id": "1",
//         "lrc": "E:\\vscode前端\\bingyan实习\\music\\lrc\\1.lrc",
//         "mp3": "E:\\scode前端\\bingyan实习\\music\\mp3\\1.mp3"
//     }
// }


// 定义 API URL
// 创建 XMLHttpRequest 对象
// 创建 XMLHttpRequest 对象

const testcontent = [{
    "id": "0",
    "name": "测试1",
    "author_name": "测试歌手1",
    "imageurl": "music/musicimage/0.jpg",
    "lrc": "E:\\vscode前端\\bingyan实习\\music\\lrc\\0.lrc",
    "mp3": "music/mp3/0.mp3"
},
{
    "id": "1",
    "name": "测试2",
    "author_name": "测试歌手2",
    "imageurl": "music/musicimage/1.jpg",
    "lrc": "E:\\vscode前端\\bingyan实习\\music\\lrc\\1.lrc",
    "mp3": "music/mp3/1.mp3"
},]
const hotcontent = []
//返回原始数据
async function callApi(apiUrl) {

    if (!apiUrl) {
        alert('请输入 API 地址');
        return;
    }

    result_raw = '请求中...';

    try {
        const response = await fetch('http://localhost:3000/call-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ apiUrl })
        });

        const data = await response.json();

        if (response.ok) {
            result_raw = JSON.stringify(data, null, 2);
            return result_raw
        } else {
            result_raw = `错误: ${data.error}\n详情: ${JSON.stringify(data.details)}`;
        }
    } catch (error) {
        result_raw = `请求失败: ${error.message}`;
    }

}

let apiResponse

// 遍历热门歌曲播放列表
function searchfree(apiResponse) {
    const freeSongHashes = [];
    apiResponse?.data?.data?.list?.forEach((playlist) => {
        // 遍历每首歌曲
        playlist?.songs?.forEach((song) => {
            // 判断是否为免费歌曲（根据你的字段逻辑调整）
            const isFree =
                (song.pay_type === 0 || song.pay_type === undefined) && // 主付费类型
                (song.price === 0 || song.price === undefined) &&        // 价格
                (song.pay_type_sq === 0 || song.pay_type_sq === undefined) && // SQ音质付费
                (song.pay_type_320 === 0 || song.pay_type_320 === undefined); // 320音质付费

            // 如果是免费歌曲且存在 hash
            if (isFree && song.hash) {
                freeSongHashes.push(song.hash);
            }
        });
    });

    return freeSongHashes
}

//渲染
const contentElement = document.querySelector('.content')
const playerbar_middle_up_middle = document.querySelector('.playerbar_middle_up_middle')
const audio = document.getElementById('audio')
const hot = document.getElementById('hot')
const musicplaybox_left_image = document.querySelector('.musicplaybox_left_image')
const musicplaybox_left_information_name = document.querySelector('.musicplaybox_left_information_name')
const musicplaybox_left_information_introduction = document.querySelector('.musicplaybox_left_information_introduction')
const music_name = document.querySelector('.music_name')
const music_synopsis = document.querySelector('.music_synopsis')



function createcontent_hot(result) {
    const url = result?.data?.url || '';
    // 遍历 result 数组，动态生成 HTML 元素
    const box = document.createElement('div');// 创建 .box 元素
    box.classList.add('box') // 添加类名
    const musicImage = document.createElement('div') // 创建 .music_image 元素
    musicImage.addEventListener('click', clickcontent)
    musicImage.classList.add('music_image')
    // musicImage.dataset.id = music.id; // 设置 id
    const imageurl = result?.data?.imgUrl?.replace(/{size}/g, '1000') || '';
    musicImage.style.backgroundImage = `url(${imageurl})` // 设置背景图片
    const musicIntroduction = document.createElement('div') // 创建 .music_introduction 元素
    const introduction = result?.data?.songName
    musicIntroduction.classList.add('music_introduction')
    musicIntroduction.innerHTML = `${introduction}` // 设置文本内容

    // 将 .music_image 和 .music_introduction 元素添加到 .box 元素
    box.appendChild(musicImage)
    box.appendChild(musicIntroduction)
    // 将生成的 .box 元素添加到 .content 中
    contentElement.appendChild(box)

    const hash = result?.data?.hash || ''
    const author_name = result?.data?.author_name || ''


    //将数据存入数组
    hotcontent.push({
        hash: `${hash}`,
        author_name: `${author_name}`,
        name: `${introduction}`,
        imageurl: `${imageurl}`,
        url: `${url}`,

    })


    //利用数组长度来添加id
    musicImage.dataset.id = `${hotcontent.length - 1}`

    //利用id识别播放对应曲目和渲染画面
    musicImage.addEventListener('click', (e) => {
        console.log(hotcontent[e.currentTarget.dataset.id].url)
        audio.src = hotcontent[e.currentTarget.dataset.id].url
        musicplaybox_left_image.style.backgroundImage = `url(${hotcontent[e.currentTarget.dataset.id].imageurl})`
        musicplaybox.style.setProperty(
            '--dynamic-bg',
            `url(${hotcontent[e.currentTarget.dataset.id].imageurl})`
        );
        musicplaybox_left_information_name.innerHTML = `${hotcontent[e.currentTarget.dataset.id].name}`
        musicplaybox_left_information_introduction.innerHTML = `歌手：${hotcontent[e.currentTarget.dataset.id].author_name}`
        music_name.innerHTML = `${hotcontent[e.currentTarget.dataset.id].name}`
        music_synopsis.innerHTML = `歌手：${hotcontent[e.currentTarget.dataset.id].author_name}`
    })

}

function clickcontent() {
    playerbar_middle_up_middle.style.backgroundImage = this.style.backgroundImage

}

function rend(api) {
    contentElement.innerHTML = ``
    console.log('666')
    callApi(api)
        .then(result => {
            apiResponse = JSON.parse(result)
            searchfree(apiResponse).forEach(musichash => {
                const str = 'http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash='
                const hash = [str, musichash].join('')
                callApi(hash)
                    .then(result => {
                        resultcreate = JSON.parse(result)
                        createcontent_hot(resultcreate)
                    })
                    .catch(error => {
                        console.error("捕获错误:", error);
                    });

            })
        })
        .catch(error => {
            console.error("捕获错误:", error);
        });
}
hot.addEventListener('click', () => {
    rend('http://mobilecdnbj.kugou.com/api/v5/special/recommend?recommend_expire=0&sign=52186982747e1404d426fa3f2a1e8ee4&plat=0&uid=0&version=9108&page=1&area_code=1&appid=1005&mid=286974383886022203545511837994020015101&_t=1545746286');
});




//渲染测试样本
function createcontent_test(testcontent) {
    testcontent.forEach((test) => {
        const url = test.mp3;
        // 遍历 result 数组，动态生成 HTML 元素
        const box = document.createElement('div');// 创建 .box 元素
        box.classList.add('box') // 添加类名
        const musicImage = document.createElement('div') // 创建 .music_image 元素
        musicImage.addEventListener('click', clickcontent)
        musicImage.classList.add('music_image')
        // musicImage.dataset.id = music.id; // 设置 id
        const imageurl = test.imageurl;
        musicImage.style.backgroundImage = `url(${imageurl})` // 设置背景图片
        const musicIntroduction = document.createElement('div') // 创建 .music_introduction 元素
        const introduction = test.author_name
        musicIntroduction.classList.add('music_introduction')
        musicIntroduction.innerHTML = `${introduction}` // 设置文本内容

        // 将 .music_image 和 .music_introduction 元素添加到 .box 元素
        box.appendChild(musicImage)
        box.appendChild(musicIntroduction)
        // 将生成的 .box 元素添加到 .content 中
        contentElement.appendChild(box)

        musicImage.dataset.id = test.id

        //利用id识别播放对应曲目
        musicImage.addEventListener('click', (e) => {
            console.log(testcontent[test.id].mp3)
            audio.src = testcontent[test.id].mp3
            musicplaybox_left_image.style.backgroundImage = `url(${testcontent[test.id].imageurl})`
            musicplaybox.style.setProperty(
                '--dynamic-bg',
                `url(../${testcontent[test.id].imageurl})`
            );
            musicplaybox_left_information_name.innerHTML = `${testcontent[test.id].name}`
            musicplaybox_left_information_introduction.innerHTML = `歌手：${testcontent[test.id].author_name}`
            music_name.innerHTML = `${testcontent[test.id].name}`
            music_synopsis.innerHTML = `歌手：${testcontent[test.id].author_name}`
        })
    })


}

const test_with_lrc = document.getElementById("test_with_lrc")
test_with_lrc.addEventListener('click', () => {
    contentElement.innerHTML = ``
    createcontent_test(testcontent)

})