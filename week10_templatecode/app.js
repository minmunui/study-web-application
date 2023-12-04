// 필요한 모듈 가져오기
const http = require('http');
const fs = require('fs').promises;
const {deleteFile, read, write} = require("./src/file");

// 서버 구동
http.createServer(async (req, res) => {
        try {
            console.log("request arrived", req.method, req.url)
            if (req.method === 'GET') {
                if (req.url === "/") {
                    console.log("get index.html")
                    const data = await fs.readFile('./html/index.html', 'utf8');
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                    return res.end(data);
                }
                if (req.url.split("?")[0] === "/user") {
                    const timestamp = req.url.split("=")[1];
                    console.log("get timestamp", timestamp)
                    read(timestamp).then((data) => {
                        console.log("get data", data)
                        res.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
                        return res.end(JSON.stringify(data));
                    })
                } else {
                    res.writeHead(404, {'Content-type': 'text/plain; charset=utf-8'});
                    return res.end("404 Not Found");
                }
            } else if (req.method === 'POST') {
                let body = ''
                await req.on('data', (chunk) => {
                    body += chunk;
                })
                if (req.url === '/user') {
                    const parsed = new URLSearchParams(body);
                    const name = parsed.get('name');
                    const id = parsed.get('id');
                    return write(name, id).then((timestamp) => {
                        res.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
                        return res.end(JSON.stringify(timestamp));
                    }).catch(
                        (error) => {
                            res.writeHead(404, {'Content-type': 'text/plain; charset=utf-8'});
                            return res.end(error)
                        }
                    )
                }
            } else if (req.method === 'DELETE') {
                let body = ''
                await req.on('data', (chunk) => {
                    body += chunk;
                })
                if (req.url === '/user') {
                    const timestamp = body;
                    console.log("delete timestamp", timestamp)
                    return deleteFile(timestamp).then((data) => {
                        res.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
                        return res.end(data);
                    }).catch((error) => {
                        console.error("delete error", error)
                        res.writeHead(404, {'Content-type': 'text/plain; charset=utf-8'});
                        return res.end(error);
                    })
                }
            }
        } catch
            (err) {
            console.error(err);
            res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
            return res.error(err.message);
        }
    }
).listen(8085, () => {
    console.log('8085번 포트에서 서버 대기 중입니다!');
});