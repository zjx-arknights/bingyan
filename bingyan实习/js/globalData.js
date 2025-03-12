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
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
    try {
        const response = await axios.get('https://m.kugou.com/app/i/getSongInfo.php', {
            params: {
                cmd: 'playInfo',
                hash: '07BC472ACDE477702A36BF02306C40F9'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('代理服务器运行在 http://localhost:3000'));

fetch('http://localhost:3000/proxy')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
