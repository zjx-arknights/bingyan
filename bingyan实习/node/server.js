const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 代理请求路由
app.post('/call-api', async (req, res) => {
    try {
        const { apiUrl } = req.body;

        // 基本安全校验
        if (!apiUrl || typeof apiUrl !== 'string') {
            return res.status(400).json({ error: '无效的 API 地址' });
        }

        // 发起请求
        const response = await axios.get(apiUrl, {
            timeout: 5000, // 5秒超时
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        res.json({
            status: response.status,
            data: response.data
        });

    } catch (error) {
        console.error('代理请求失败:', error);
        res.status(500).json({
            error: error.message,
            details: error.response?.data || '无额外错误信息'
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});