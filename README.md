# bingyan
冰岩实习记录
### 项目介绍
一款简单的音乐播放器，可以搜索和获取免费热门歌曲，音乐源来自酷狗音乐，支持本地和云端存储
### 特色功能
- 支持歌词滚动，进度条，音量调节
- 支持创建收藏歌单，记载播放记录
- 支持白天黑夜两种主题模式切换
- 支持本地（locastorage浏览器缓存)和云端(mysql)存储数据
- 许多独特ui设计
### 使用须知
- 可直接访问music.zhoujx.com（受限于api，可能出现数据接收错误返回undefine情况，不稳定）
- 下载源代码本地使用需要nodejs环境，并提前运行servers.js文件
```javascript
node servers.js
```
- 本地使用需修改globaldata.js和servers.js文件中的mysql代码并配置为你自己的mysql数据库，如果不需要mysql存储也可直接删除该部分代码,本身也具有存储在浏览器缓存（local storage）的功能（注意如果清除浏览器历史纪录则失效）
