const express = require('express')
const router = express.Router()
//定义了一个 POST 请求的路由 /post，当客户端向 /api/post 发送 POST 请求时，会触发这个路由处理函数
router.post('/post', (req, res) => {

    const body = req.body
    let aaa = '0'
    if (body.name == 'zjx') {
        aaa = '1'
    }

    res.send({
        status: 0,
        msg: 'post请求成功',
        data: aaa
    })



})



module.exports = router