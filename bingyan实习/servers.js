const express = require('express');
const app = express();
const axios = require('axios');
const mysql = require('mysql2');
// 解析表单中间件
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());
app.use(express.json()); // 解析 JSON 请求体
//使用 app.use('/api', router) 将 apiRunter.js 中定义的路由挂载到 /api 路径下。
const router = require('./apiRunter');
app.use('/api', router);


// ①导入path
const path = require('path');
// ②静态托管当前目录
app.use(express.static(path.join(__dirname, 'public')));

// ③访问根目录时返回index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

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

//mysql路由
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'bingyan_musicplay_download',
});

// 路由处理查询请求
app.post('/check-user', (req, res) => {
    const { name, password } = req.body;

    // 检查请求体中是否包含name和password
    if (!name || !password) {
        return res.status(400).json({ error: 'Name and password are required' });
    }

    // 查询数据库
    const sql = 'SELECT list FROM bingyan_musicplay_download_data WHERE name = ? AND password = ?';
    db.query(sql, [name, password], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // 检查是否有匹配的数据
        if (result.length > 0) {
            res.json({ list: result[0].list }); // 返回list字段
        } else {
            res.json('000'); // 没有找到匹配的数据
        }
    });
});

// 路由处理更新请求
app.post('/update-list', (req, res) => {
    const { name, password, list } = req.body;

    // 检查请求体中是否包含name、password和list
    if (!name || !password || !list) {
        return res.status(400).json({ error: 'Name, password, and list are required' });
    }

    // 检查用户是否存在
    const checkUserSql = 'SELECT * FROM bingyan_musicplay_download_data WHERE name = ? AND password = ?';
    db.query(checkUserSql, [name, password], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // 如果用户不存在
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 更新用户的list数据
        const updateListSql = 'UPDATE bingyan_musicplay_download_data SET list = ? WHERE name = ? AND password = ?';
        db.query(updateListSql, [JSON.stringify(list), name, password], (err, result) => {
            if (err) {
                console.error('Database update error:', err);
                return res.status(500).json({ error: 'Failed to update list' });
            }

            // 返回成功响应
            res.json({ message: 'List updated successfully' });
        });
    });
});

// 路由处理插入数据请求
app.post('/insert-data', (req, res) => {
    const { name, password, list } = req.body;

    // 检查请求体中是否包含name、password和list
    if (!name || !password || !list) {
        return res.status(400).json({ error: 'Name, password, and list are required' });
    }

    // 插入数据到数据库
    const insertSql = 'INSERT INTO bingyan_musicplay_download_data (name, password, list) VALUES (?, ?, ?)';
    db.query(insertSql, [name, password, JSON.stringify(list)], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ error: 'Failed to insert data' });
        }

        // 获取插入的记录的ID
        const insertedId = result.insertId;

        // 查询刚刚插入的记录
        const selectSql = 'SELECT list FROM bingyan_musicplay_download_data WHERE id = ?';
        db.query(selectSql, [insertedId], (err, result) => {
            if (err) {
                console.error('Database select error:', err);
                return res.status(500).json({ error: 'Failed to fetch inserted data' });
            }

            // 返回插入的list数据
            res.json({ list: result[0].list });
        });
    });
});


// 启动服务器
app.listen(55566, () => {
    console.log('Express server running at http://127.0.0.1:55566');
});

