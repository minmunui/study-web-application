const getPromise = () => {
    return new Promise((resolve, reject) => {
        const random = Math.floor(Math.random() * 10);
        setTimeout(() => {
            if (true) {
                resolve('Success');
            } else {
                reject('Fail');
            }
        }, 2000);
    });
}

const awaitMain = async () => {
    console.log('Start')
    const result = await getPromise();
    console.log("result", result);
    return result;
}

const thenMain = async () => {
    console.log('Start')
    const result = getPromise()
        .then((result) => {
            return result
        })
        .catch((error) => {
            return error
        })
    console.log("result", result);
}
