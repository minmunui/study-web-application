// 필요한 모듈 가져오기
const fs = require("fs").promises;

async function write(name, id) {
    return new Promise((resolve, reject) => {
            const now = Date.now();
            const filePath = `./data/${now}.json`;
            const data = {
                name: name,
                id: id,
            }
            console.log(`${filePath} is created. ${JSON.stringify(data)}`)
            fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8').then(() => {
                    resolve(now);
                }
            ).catch(
                (error) => {
                    reject(error)
                }
            )
        }
    )
}

async function read(timestamp) {
    return new Promise((resolve, reject) => {
            console.log(`read ${timestamp}`)
            const filePath = `./data/${timestamp}.json`;
            try {
                fs.readFile(filePath, 'utf8').then((data) => {
                        console.log(`${filePath} is read. ${data}`)
                        resolve(JSON.parse(data));
                    }
                )
            } catch (error) {
                reject(error);
            }
        }
    )
}

async function deleteFile(timestamp) {
    return new Promise((resolve, reject) => {
            const filePath = `./data/${timestamp}.json`;
            console.log(`delete ${filePath}`)
            // 파일의 존재 여부를 체크한다.
            fs.unlink(filePath).then(() => {
                    console.log(`${timestamp} is deleted.`)
                    resolve("success");
                }
            ).catch(
                (error) => {
                    console.log(`${timestamp} is not found. error : ${error}`)
                    reject(error);
                }
            )
        }
    )
}

module.exports = {
    write,
    read,
    deleteFile
}