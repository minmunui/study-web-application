const {Console} = require('console');
const fs = require('fs').promises;
const fs2 = require('fs');
const readline = require('readline');

const userDataFile = 'users.json'; // 사용자 정보를 저장할 파일 경로
// 입력받기 위한 모듈
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// delay 함수 완성
// setTimeout 및 Promise 활용
const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ms);
        }, ms);
    });
};
// 비동기 함수로 사용자 정보 읽기
// 프로미스 체이닝 및 캐치 활용
function readUserData() {
    return fs.readFile(userDataFile, 'utf8')
        .then((data) => {
            return JSON.parse(data);
        })
        .catch((error) => {
                if (error.code === 'ENOENT') {
                    return [];
                } else {
                    throw error;
                }
            }
        )
}


// 비동기 함수로 사용자 정보 저장 (완성되어 있음)
function saveUserData(users) {
    return new Promise((resolve, reject) => {
        fs2.writeFile(userDataFile, JSON.stringify(users, null, 2), 'utf8', (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

// 비동기 함수로 사용자 추가
/* Todo */
function addUser(user) {
    return new Promise((resolve, reject) => {
            // 사용자 정보 읽기
            readUserData()
                .then(async (users) => {
                    if (users.some((item) => item.email === user.email || item.name === user.name)) {
                        reject(`이름 : ${user.name} 또는 이메일 : ${user.email}이 중복됩니다.`);
                    } else {
                        // 새 사용자 추가
                        users.push(user);
                        delay(2000)
                            .then((delay) => {
                                console.log(`새 사용자가 추가되었습니다.${delay}`);
                            })
                            .then(() => saveUserData(users))
                            .then(() => {
                                resolve()
                            })
                    }
                })
        }
    )
}


// 비동기 함수로 사용자 목록 출력
/* Todo */
function listUsers() {
    // 사용자 정보 읽기 및 출력
    const FIRST_INDEX = 3001;
    return new Promise((resolve, reject) => {
        readUserData()
            .then((users) => {
                if (users.length === 0) {
                    console.log('사용자 정보가 없습니다.');
                    resolve();
                } else {
                    console.log("사용자 목록:")
                    users.forEach((item, index) => {
                        console.log(`${index + FIRST_INDEX}. ${item.name} (${item.email})`);
                    });
                    resolve();
                }
            })
    })
}

// 비동기 함수로 사용자 관리
/* Todo */
async function main() {
    while (true) {
        console.log('1. 사용자 정보 읽기');
        console.log('2. 사용자 추가');

        const choice = await new Promise((resolve, reject) => {
            rl.question('선택하려는 번호를 입력하세요 (또는 "q"를 입력하여 종료): ', async (userInput) => {
                    switch (userInput) {
                        case '1':
                            await listUsers();
                            resolve();
                            break;
                        case '2':
                            rl.question('이름을 입력하세요: ', (name) => {
                                rl.question('이메일을 입력하세요: ', async (email) => {
                                    await addUser({
                                        name: name,
                                        email: email
                                    })
                                    resolve();
                                })
                            })
                            break;
                        case 'q':
                            console.log("프로그램을 종료합니다.");
                            resolve("q")
                            break;
                        default:
                            console.log("잘못된 선택입니다. 다시 선택해주세요.");
                            resolve();
                            break;
                    }
                }
            );
        });
        if (choice === "q") {
            break;
        }
    }
    rl.close();
}

main()



