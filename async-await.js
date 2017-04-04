// define async function return as a promise object
async function calculator (a, b) {
    let result;

    try {
        result = await a + b;
    } catch (error) {
        result = await 'error';
    }

    return result;
}

// caller 01
calculator(1, 2)
.then((resolve) => {
    console.log(resolve);
})
.catch((reason) => {
    console.log(reason);
});

// caller 02
const resultOfCalculator = async () => {
    console.log(await calculator(1, 2));
};

resultOfCalculator();