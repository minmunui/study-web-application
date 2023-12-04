const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const asyncAwaitTask = async () => {
    console.log("Start");
    await delay(2000);
    console.log("End");
}

asyncAwaitTask();