const randomTask = (successChance = 0.5) => {
    const random = Math.random();
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (random < successChance) {
                console.log("Success")
                resolve(true);
            } else {
                console.log("Error")
                reject(false);
            }
        }, 2000);
    });
}

const retryRandomTask = async (retryCount = 3) => {
    for (let i = 0; i < retryCount; i++) {
        const success = await randomTask()
            .then((result) => result)
            .catch((result) => result)
        if (success) {
            return;
        }
    }
    console.log("Fail after 3 attempts")
}


retryRandomTask();