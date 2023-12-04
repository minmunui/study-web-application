// 필요한 모듈 가져오기
const fs = require("fs").promises;

// write 함수, name과 id를 인자로 받아서 data 폴더 내 현재 timestamp 값을 이름으로 하는 파일을 생성 후 name과 id를 json형태로 기록 후 timestamp 값을 return한다.
export const write = async  (name, id) => {
    // 현재 시간 받아오기
    const now = Date.now();
    // 현재 시간을 이름으로 하는 경로 생성하기
    const filePath = `./data/${now}.json`;

    // json 파일에 쓰기 위한 포맷(객체) 구성
    const data = {
        name: name,
        id: id,
    }
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8').then(() => {
        // 그리고 ID의 역할을 할 timestamp를 반환한다.
        return Promise.resolve(now);
    }).catch(
        // error 발생 시 error 반환
        (error) => {
            return Promise.reject(error)
        }
    )
}

// read 함수, timestamp를 인자로 받아, timestamp에 해당하는 파일을 찾아 읽는다. 해당 파일이 없다면 오류를 반환한다.
export const read = async (timestamp) => {
    // 인자로 받은 timestamp를 이용해 파일 경로를 설정한다.
    const filePath = `./data/${timestamp}.json`;
    // 이 때 파일이 있다면 읽는다.
    // 파일 읽기
    try {
        fs.readFile(filePath, 'utf8').then((data) => {
                // 반환한다.
                return Promise.resolve(JSON.parse(data));
            }
        )
        // 파일을 제대로 읽어오지 못했다면
    } catch (error) {
        // error를 반환한다.
        return Promise.reject(error);
    }
}

// deleteFile함수, 원래 delete라는 이름으로 하려 했으나, 중복된다는 이유로 deleteFile로 하였다.
export const deleteFile = async (timestamp) => {
    // 인자로 받은 timestamp를 이용해 파일 경로를 설정한다.
    const filePath = `./data/${timestamp}.json`;

    // 파일을 삭제한다.
    fs.unlink(filePath).then(() => {
        console.log(`${timestamp} is deleted.`)
        return Promise.resolve(0);
    }).catch(
        (error) => {
            return Promise.reject(error);
        }
    )

}