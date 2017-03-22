let request = require('request');
const _nasaJSON = 'https://data.nasa.gov/resource/q83n-bbjy.json';

async function getNasaDataService () {
    return request.get(_nasaJSON).end();
}

async function caller () {
    try {
        let result = await getNasaDataService();
        return result.body;
    } catch (error) {
        console.error(error);
    }
}

caller().then((response) => {
    console.log(response);
});