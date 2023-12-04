const solutionA = (arrayToPrint) => {
    arrayToPrint.forEach((element, index) => {
        setTimeout(() => {
                console.log(element);
            }
            , 1000 * (1 + index));
    })
}

solutionA(["First", "Second", "Third"]);