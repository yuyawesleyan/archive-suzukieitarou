const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));

// タイムラインのデータを保存するための配列
let timeline = [];

// クライアントが接続したときの処理
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // タイムラインのデータを送信
  socket.emit('timelineUpdate', timeline);

  // タイムラインデータの受信と配信
  socket.on('newTimeline', (data) => {
    timeline.push(data);
    io.emit('timelineUpdate', timeline);
  });

  // メッセージ受信の処理
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // クライアントが切断したときの処理
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
