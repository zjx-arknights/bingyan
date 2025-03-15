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
const lyric_container = document.querySelector('.lyric_container')
const search_show_content = document.querySelector('.search_show_content')
const search_show_head_right = document.querySelector('.search_show_head_right')
const panel_content = document.querySelector('.panel-content')
const music_list_all_head_left = document.querySelector('.music_list_all_head_left')

// 获取所有子盒子元素
let panel_content_children = document.querySelectorAll('.panel-content .panel_content_list');

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
let hotcontent = []
let searchcontent = []
//返回原始数据
let lyricData = ``//原始歌词
let lyrics = []//切割好的歌词
let currentLyricIndex = 0;
let apiResponse
//歌词部分
let playnow = []
let hadplaylist = []



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


// 遍历热门歌曲播放列表，挑选出免费歌曲
function searchfree(apiResponse) {
    const freeSongHashes = [];
    apiResponse?.data?.data?.list?.forEach((playlist) => {
        // 遍历每首歌曲
        playlist?.songs?.forEach((song) => {
            // 判断是否为免费歌曲（根据你的字段逻辑调整）
            const isFree =
                (song.pay_type === 0 || song.pay_type === undefined) && // 主付费类型
                (song.price === 0 || song.price === undefined)         // 价格
            // (song.pay_type_sq === 0 || song.pay_type_sq === undefined) && // SQ音质付费
            // (song.pay_type_320 === 0 || song.pay_type_320 === undefined); // 320音质付费
            //暂时只做普通音质，后面有时间可以增加切换音质功能
            // 如果是免费歌曲且存在 hash
            if (isFree && song.hash) {
                freeSongHashes.push(song.hash);
            }
        });
    });

    return freeSongHashes
}
// 遍历搜索歌曲播放列表,挑选出免费歌曲
function searchfree_search(apiResponse) {
    const freeSongHashes_search = [];
    apiResponse?.data?.data?.info?.forEach((song) => {
        // 遍历每首歌曲
        // 判断是否为免费歌曲
        const isFree =
            (song.pkg_price_sq === 0 || song.pkg_price_sq === undefined) // 主付费类型
        // (song.price === 0 || song.price === undefined)
        // 价格
        // (song.pay_type_sq === 0 || song.pay_type_sq === undefined) && // SQ音质付费
        // (song.pay_type_320 === 0 || song.pay_type_320 === undefined); // 320音质付费
        //暂时只做普通音质，后面有时间可以增加切换音质功能
        // 如果是免费歌曲且存在 hash
        if (isFree && song.hash) {
            freeSongHashes_search.push(song.hash);
        }
    });
    return freeSongHashes_search
}

//渲染热门歌曲
function createcontent_hot(result) {
    const url = result?.data?.url || '';
    // 遍历 result 数组，动态生成 HTML 元素
    const box = document.createElement('div');// 创建 .box 元素
    box.classList.add('box') // 添加类名
    const musicImage = document.createElement('div') // 创建 .music_image 元素
    // musicImage.addEventListener('click', clickcontent)
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
        songname: `${author_name}`,
        singername: `${introduction}`,
        imageurl: `${imageurl}`,
        url: `${url}`,

    })

    //利用数组长度来添加id
    musicImage.dataset.id = `${hotcontent.length - 1}`

    //利用id识别播放对应曲目和渲染画面
    //同时利用储存的hash值查询歌词
    musicImage.addEventListener('click', (e) => {
        playerbar_middle_up_middle.style.backgroundImage = `url(${hotcontent[e.currentTarget.dataset.id].imageurl})`
        // console.log(hotcontent[e.currentTarget.dataset.id].url)
        audio.src = hotcontent[e.currentTarget.dataset.id].url
        musicplaybox_left_image.style.backgroundImage = `url(${hotcontent[e.currentTarget.dataset.id].imageurl})`
        musicplaybox.style.setProperty(
            '--dynamic-bg',
            `url(${hotcontent[e.currentTarget.dataset.id].imageurl})`
        );
        musicplaybox_left_information_name.innerHTML = `${hotcontent[e.currentTarget.dataset.id].songname}`
        musicplaybox_left_information_introduction.innerHTML = `歌手：${hotcontent[e.currentTarget.dataset.id].singername}`
        music_name.innerHTML = `${hotcontent[e.currentTarget.dataset.id].songname}`
        music_synopsis.innerHTML = `歌手：${hotcontent[e.currentTarget.dataset.id].singername}`
        //寻找歌词
        searchlyric(hotcontent[e.currentTarget.dataset.id].hash)
        //加入已播放列表
        createmusiclist(hotcontent[e.currentTarget.dataset.id].songname, hotcontent[e.currentTarget.dataset.id].singername, hotcontent[e.currentTarget.dataset.id].hash, hotcontent[e.currentTarget.dataset.id].url, hotcontent[e.currentTarget.dataset.id].imageurl)
    })

}

//渲染搜索歌曲
function createcontent_search(result) {
    const hash = result?.data?.hash || ''
    const imageurl = result?.data?.imgUrl?.replace(/{size}/g, '1000') || '';
    const songname = result?.data?.songName || ''
    const singername = result?.data?.singerName || ''
    const url = result?.data?.url || ''

    //将数据存入数组
    searchcontent.push({
        hash: `${hash}`,
        singername: `${singername}`,
        songname: `${songname}`,
        imageurl: `${imageurl}`,
        url: `${url}`,
    })



    // 创建最外层的 div 元素
    const searchShowContentList = document.createElement('div');
    searchShowContentList.className = 'search_show_content_list';
    searchShowContentList.dataset.id = `${searchcontent.length - 1}`
    // 创建包含图片的 div 元素
    const searchShowContentListImage = document.createElement('div');
    searchShowContentListImage.className = 'search_show_content_list_image';

    // 创建图片框 div 元素
    const searchShowContentListImagebox = document.createElement('div');
    searchShowContentListImagebox.className = 'search_show_content_list_imagebox';
    searchShowContentListImagebox.style.backgroundImage = `url(${imageurl})`

    // 将图片框 div 添加到图片 div 中
    searchShowContentListImage.appendChild(searchShowContentListImagebox);

    // 创建包含介绍的 div 元素
    const searchShowContentListIntroduction = document.createElement('div');
    searchShowContentListIntroduction.className = 'search_show_content_list_introduction';

    // 创建名称 div 元素
    const searchShowContentListIntroductionName = document.createElement('div');
    searchShowContentListIntroductionName.className = 'search_show_content_list_introduction_name';
    searchShowContentListIntroductionName.innerHTML = `${songname}`;

    // 创建歌手 div 元素
    const searchShowContentListIntroductionSinger = document.createElement('div');
    searchShowContentListIntroductionSinger.className = 'search_show_content_list_introduction_singer';
    searchShowContentListIntroductionSinger.innerHTML = `${singername}`;

    // 将名称和歌手 div 添加到介绍 div 中
    searchShowContentListIntroduction.appendChild(searchShowContentListIntroductionName);
    searchShowContentListIntroduction.appendChild(searchShowContentListIntroductionSinger);

    // 创建专辑 div 元素
    const searchShowContentListAlbum = document.createElement('div');
    searchShowContentListAlbum.className = 'search_show_content_list_album';
    searchShowContentListAlbum.innerHTML = `专辑`;

    // 创建包含添加按钮的 div 元素
    const searchShowContentListAdd = document.createElement('div');
    searchShowContentListAdd.className = 'search_show_content_list_add';

    // 创建添加到当前播放的 img 元素
    const searchShowContentListAddToMyList = document.createElement('img');
    searchShowContentListAddToMyList.className = 'search_show_content_list_addtomylist';
    searchShowContentListAddToMyList.title = '添加到当前播放';
    searchShowContentListAddToMyList.src = 'svg/search_show_content_list_addtomylist.svg';

    // 创建添加到我的歌单的 img 元素
    const searchShowContentListAddToNowPlay = document.createElement('img');
    searchShowContentListAddToNowPlay.className = 'search_show_content_list_addtonowplay';
    searchShowContentListAddToNowPlay.title = '添加到我的歌单';
    searchShowContentListAddToNowPlay.src = 'svg/search_show_content_list_addtonowplay.svg';

    // 将两个 img 元素添加到添加按钮 div 中
    searchShowContentListAdd.appendChild(searchShowContentListAddToMyList);
    searchShowContentListAdd.appendChild(searchShowContentListAddToNowPlay);

    // 将所有子元素添加到最外层的 div 中
    searchShowContentList.appendChild(searchShowContentListImage);
    searchShowContentList.appendChild(searchShowContentListIntroduction);
    searchShowContentList.appendChild(searchShowContentListAlbum);
    searchShowContentList.appendChild(searchShowContentListAdd);

    // 将最外层的 div 添加到文档中的某个容器中
    search_show_content.appendChild(searchShowContentList); // 你可以将 body 替换为其他容器

    //双击事件，避免误触
    searchShowContentList.addEventListener('dblclick', (e) => {
        // console.log('7766')
        // console.log(searchcontent[e.currentTarget.dataset.id].url)
        playerbar_middle_up_middle.style.backgroundImage = `url(${searchcontent[e.currentTarget.dataset.id].imageurl})`

        audio.src = searchcontent[e.currentTarget.dataset.id].url
        musicplaybox_left_image.style.backgroundImage = `url(${searchcontent[e.currentTarget.dataset.id].imageurl})`
        musicplaybox.style.setProperty(
            '--dynamic-bg',
            `url(${searchcontent[e.currentTarget.dataset.id].imageurl})`
        );
        musicplaybox_left_information_name.innerHTML = `${searchcontent[e.currentTarget.dataset.id].songname}`
        musicplaybox_left_information_introduction.innerHTML = `歌手：${searchcontent[e.currentTarget.dataset.id].singername}`
        music_name.innerHTML = `${searchcontent[e.currentTarget.dataset.id].songname}`
        music_synopsis.innerHTML = `歌手：${searchcontent[e.currentTarget.dataset.id].singername}`
        //寻找歌词
        searchlyric(searchcontent[e.currentTarget.dataset.id].hash)
        //将其数据存入正在播放
        playnow = searchcontent[e.currentTarget.dataset.id]

        createmusiclist(searchcontent[e.currentTarget.dataset.id].songname, searchcontent[e.currentTarget.dataset.id].singername, searchcontent[e.currentTarget.dataset.id].hash)

    })

}


function clickcontent() {
    playerbar_middle_up_middle.style.backgroundImage = this.style.backgroundImage

}

function rend(api) {
    contentElement.innerHTML = ``;
    console.log('666');

    callApi(api)
        .then(result => {
            apiResponse = JSON.parse(result);
            searchfree(apiResponse).forEach((musichash, index) => {
                // 给每次请求加上延时（比如2000ms，也就是2秒）
                setTimeout(() => {
                    const str = 'http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=';
                    const hash = [str, musichash].join('');
                    console.log(hash);

                    callApi(hash)
                        .then(result => {
                            resultcreate = JSON.parse(result);
                            createcontent_hot(resultcreate);
                        })
                        .catch(error => {
                            console.error("捕获错误:", error);
                        });
                }, index * 200); // 每次请求之间延时2秒
            });
        })
        .catch(error => {
            console.error("捕获错误:", error);
        });
}


function rend_search(api) {
    callApi(api)
        .then(result => {
            apiResponse = JSON.parse(result)
            let searchfree_search_hash = searchfree_search(apiResponse)
            console.log(searchfree_search_hash)
        })
        .catch(error => {
            console.error("捕获错误:", error);
        });
}

// rend_search('http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=天下&page=10')

hot.addEventListener('click', () => {
    hotcontent = []
    rend('http://mobilecdnbj.kugou.com/api/v5/special/recommend?recommend_expire=0&sign=52186982747e1404d426fa3f2a1e8ee4&plat=0&uid=0&version=9108&page=1&area_code=1&appid=1005&mid=286974383886022203545511837994020015101&_t=1545746286');
});
//点击搜索并渲染
async function search_and_rend() {
    searchcontent = [];
    if (!search_show.classList.contains('search_show_show')) {
        search_show.classList.add('search_show_show');
    }
    search_show_content.innerHTML = ``;
    const freeSongHashesAll = [];
    const search_key = document.getElementById("inputField").value;
    search_show_head_right.innerHTML = `"${search_key}"`;

    // 添加延迟函数
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    if (search_key.trim() !== "") {
        try {
            // 分页请求添加间隔
            for (let i = 1; i < 6; i++) {
                const search_api = `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${search_key}&page=${i}`;
                const search_result_raw = await callApi(search_api);
                await delay(200);  // 每次分页请求后等待

                const search_result_raw_obj = JSON.parse(search_result_raw);
                const hashes = searchfree_search(search_result_raw_obj);
                freeSongHashesAll.push(...hashes);
            }

            // 哈希请求添加间隔
            for (const hash of freeSongHashesAll) {
                const search_everyhash_api = `http://m.kugou.com/app/i/getSongInfo.php?cmd=playInfo&hash=${hash}`;
                const everysearch_result_raw = await callApi(search_everyhash_api);
                await delay(200);  // 每次哈希请求后等待

                const everysearch_result = JSON.parse(everysearch_result_raw);
                createcontent_search(everysearch_result);
            }
        } catch (error) {
            console.error("捕获错误:", error);
        }
    } else {
        console.log("输入框为空");
    }
}

//渲染播放过的歌曲
function createmusiclist(name, singer, hash, url, img) {
    // 创建外层 div 元素
    //通过hash查看之前有无重复的，有就删除旧的

    if (document.getElementById(hash)) {
        document.getElementById(hash).remove();
        hadplaylist = hadplaylist.filter(item => item.hash !== hash);
        console.log('元素已删除');
    }
    //加入播放过的列表
    hadplaylist.push({
        hash: hash,
        singername: singer,
        songname: name,
        imageurl: img,
        url: url
    })

    const panelContentList = document.createElement('div');
    panelContentList.classList.add('panel_content_list');
    panelContentList.id = hash
    // 创建并添加歌曲名称 div 元素
    const panelContentListName = document.createElement('div');
    panelContentListName.classList.add('panel_content_list_name');
    panelContentListName.textContent = name;  // 设置歌曲名称

    // 创建并添加歌手名称 div 元素
    const panelContentListSinger = document.createElement('div');
    panelContentListSinger.classList.add('panel_content_list_singer');
    panelContentListSinger.textContent = singer;  // 设置歌手名称

    // 创建并添加删除按钮 div 元素
    const panelContentListDelete = document.createElement('div');
    panelContentListDelete.classList.add('panel_content_list_delete');

    // 将子元素添加到外层 div 中
    panelContentList.appendChild(panelContentListName);
    panelContentList.appendChild(panelContentListSinger);
    panelContentList.appendChild(panelContentListDelete);

    panel_content.appendChild(panelContentList)
    //更新数量
    get_panel_content_list_number()
}
//删除按键删除
document.querySelector('.panel-content').addEventListener('click', (event) => {
    if (event.target.classList.contains('panel_content_list_delete')) {
        // 找到被点击的删除按钮的父盒子
        const parent = event.target.closest('.panel_content_list');
        if (parent) {
            // 获取父盒子在 .panel-content 中的索引
            const index = Array.from(parent.parentNode.children).indexOf(parent);
            hadplaylist.splice(index, 1)
            // 删除父盒子
            parent.remove();
            // console.log(hadplaylist)
            //更新数量
            get_panel_content_list_number()
        }
    }
});
//获取子盒子数量
function get_panel_content_list_number() {
    panel_content_children = document.querySelectorAll('.panel-content .panel_content_list')
    const numberOfChildren = panel_content_children.length
    music_list_all_head_left.innerHTML = `共${numberOfChildren}首`

}


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
            currentLyricIndex = 0
        })
    })


}

const test_with_lrc = document.getElementById("test_with_lrc")

test_with_lrc.addEventListener('click', () => {
    contentElement.innerHTML = ``
    createcontent_test(testcontent)
})


//base64解码并截取歌词部分
function decodeBase64(base64Str) {
    // 解码 Base64 字符串为二进制字符串
    const binaryStr = atob(base64Str);

    // 将二进制字符串转为字节数组（处理非 ASCII 字符）
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    // 将字节数组解码为 UTF-8 字符串
    const lyric_raw = new TextDecoder().decode(bytes)
    //截取正式歌词部分
    return lyric_raw.split('\n')
        .filter(line => /^\[\d{2}:\d{2}\.\d{2}\].+/.test(line))
        .join('\n');
}

function searchlyric(hash) {
    const hash_accesskey = `http://krcs.kugou.com/search?ver=1&man=yes&client=mobi&keyword=&duration=&hash=${hash}&album_audio_id=`
    callApi(hash_accesskey)
        .then(result_raw => {
            result = JSON.parse(result_raw)
            const accesskey = result?.data?.candidates[0].accesskey
            const id = result?.data?.candidates[0].id
            const api_lyric = `http://lyrics.kugou.com/download?ver=1&client=pc&id=${id}&accesskey=${accesskey}&fmt=lrc&charset=utf8`
            callApi(api_lyric)
                .then(result => {
                    base64Str_raw = JSON.parse(result)
                    const base64Str = base64Str_raw.data.content
                    lyricData = decodeBase64(base64Str)
                    lyrics = parseLyric(lyricData)
                    // 初始化歌词并开始播放
                    loadLyrics(lyrics);
                    currentLyricIndex = 0
                })
                .catch(error => {
                    console.error("捕获错误:", error);
                });

        })
        .catch(error => {
            console.error("捕获错误:", error);
        });
}



//渲染歌词部分
// 解析歌词
function parseLyric(text) {
    const lines = text.split('\n');
    const pattern = /\[(\d+):(\d+\.\d+)\](.+)/;
    const lyric = [];

    lines.forEach(line => {
        if (line.match(pattern)) {
            const [, min, sec, text] = line.match(pattern);
            const time = parseFloat(min) * 60 + parseFloat(sec);
            lyric.push({ time, text: text.trim() });
        }
    });

    return lyric;
}


const container = document.querySelector('.lyric_container');


// 将歌词添加到容器
function loadLyrics(lyrics_load) {
    //先清空之前的歌词
    lyric_container.innerHTML = ``
    lyrics_load.forEach(lyric => {
        const lyricline = document.createElement('div');
        lyricline.classList.add('lyric_line');
        lyricline.innerHTML = lyric.text;
        container.appendChild(lyricline);
    });
}