// 필요한 모듈 가져오기
import {deleteFile, read, write} from "./src/file";

const http = require('http');
const fs = require('fs').promises;
// 서버 구동
http.createServer(async (req, res) => {
    try {
        if (req.method === 'GET') {
            if (req.url === "/") {
                const data = await fs.readFile('./html/index.html', 'utf8');
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            }
            if (req.url === "/user") {
                const timestamp = req.url.split("=")[1];
                res.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
                read(timestamp).then((data) => {
                    res.end(JSON.stringify(data));
                })
            } else {
                res.writeHead(404, {'Content-type': 'text/plain; charset=utf-8'});
                return res.end("404 Not Found");
            }
        } else if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
                body += chunk;
            })
            if (req.url === '/user') {
                const parsed = new URLSearchParams(body);
                const name = parsed.get('name');
                const id = parsed.get('id');
                console.log("name: " + name + " id: " + id)
                res.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
                return write(name, id).then((timestamp) => {
                    res.end(timestamp.toString());
                })
            }
        } else if (req.method === 'DELETE') {
            let body = ''
            req.on('data', (chunk) => {
                body += chunk;
            })
            if (req.url === '/user') {
                const parsed = new URLSearchParams(body);
                const timestamp = parsed.get('timestamp');
                res.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
                return deleteFile(timestamp).then((data) => {
                    res.end(true);
                }).catch((error) => {
                    res.end(false);
                })
            }
        }
    } catch
        (err) {
        res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end(err.message);
    }
})
    .listen(8086, () => {
            console.log('8085번 포트에서 서버 대기 중입니다.');
        }
    )
// 요청이 GET일 경우

// url이 / 일 경우

// html파일을 읽어서

// res msg로 반환

// 요청 종료

// url이 /user 일 경우 /user?timestamp=... 의 형태로 요청하므로 다음과 같이 조건을 건다.

// =을 기준으로 파싱하여 timestamp정보만 얻는다.

// timestamp에 값이 있다면

// file의 read함수를 이용하여 정보를 읽어온다.

// 200 상태 코드와 함께 json 파일을 응답할 것이다.

// 사용자 정보를 응답으로 보낸다.

// 만약 없는 것을 요구할 경우 404 상태 코드와 함께 적당한 text를 보낸다.

// 해당 문자열을 반환한다.

// 요청이 POST일 경우

// url이 /user 일 경우

// 클라이언트로 부터 받은 데이터를 저장하기 위한 변수를 선언한다.

// 클라이언트로 부터 받은 데이터를 chunk 단위로 읽어 body에 저장한다.

// 클라이언트가 데이터 전송을 완료 했다면

// 받은 데이터를 파싱 한 후

// 파싱한 데이터를 key를 이용 해 각각 저장한다.

// write 함수를 이용 해 파일 생성 및 저장

// 중간에 오류가 발생하지 않았다면 200 상태 코드와 함께 문자열을 보낸다.

// timestamp를 보낸다.

// error 발생 시 500 상태 코드와 함께 error 메시지를 보낸다.

// error 메시지는 다음과 같다.

// 요청이 DELETE 일 경우

// 그리고 url이 user일 경우

// POST와 마찬가지로 클라이언트로 부터 받은 데이터를 저장하기 위한 변수를 선언한다.

// 또한 chunk 단위로 읽어 body에 저장한다.

// 데이터 전송이 완료 되었다면

// 이번엔 timestamp만 받았으므로 parseInt로 파싱한다.

// timestamp에 값이 있다면

// deleteFile을 수행한다.

// 제대로 수행이 되었다면 상태코드 200과 함께 문자열을 반환한다.

// 문자열은 다음과 같다.

// error 발생 시 500 상태 코드와 함께 error 메시지를 보낸다.

// error 메시지는 다음과 같다.

// 애초에 서버 자체가 제대로 구동되지 않는다면

// error를 발생시키고

// 상태코드 500 과 함께 문자열을 반환한다.

// error 메시지는 다음과 같다.

// port 번호는 다음과 같다.

// 서버 대기

