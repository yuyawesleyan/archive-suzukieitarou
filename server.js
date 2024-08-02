const http = require('http');
const { MongoClient } = require('mongodb');
const querystring = require('querystring');

const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'userRegistration';

// MongoDB接続
async function connectToMongo() {
    const client = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
    await client.connect();
    return client.db(DB_NAME);
}

http.createServer(async (req, res) => {
    if (req.method === 'GET') {
        // 登録フォームの提供
        if (req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html lang="ja">
                <head>
                    <meta charset="UTF-8">
                    <title>ユーザー登録</title>
                </head>
                <body>
                    <h1>ユーザー登録</h1>
                    <form method="POST" action="/register">
                        <label for="username">ユーザー名:</label>
                        <input type="text" id="username" name="username" required>
                        <br>
                        <label for="password">パスワード:</label>
                        <input type="password" id="password" name="password" required>
                        <br>
                        <button type="submit">登録</button>
                    </form>
                </body>
                </html>
            `);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('ページが見つかりません');
        }
    } else if (req.method === 'POST' && req.url === '/register') {
        // 登録処理
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            const { username, password } = querystring.parse(body);
            const db = await connectToMongo();
            const collection = db.collection('users');
            try {
                await collection.insertOne({ username, password });
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('登録が成功しました！');
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('登録に失敗しました。');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('ページが見つかりません');
    }
}).listen(PORT, () => {
    console.log(`サーバーがポート ${PORT} で起動しました`);
});
