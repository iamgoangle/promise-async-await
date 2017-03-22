let request = require('request');
const _nasaJSON = 'https://data.nasa.gov/resource/q83n-bbjy.json';

function getNasaDataService () {
    return new Promise((resolve, reject) => {
        request.get(_nasaJSON, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(body);
            }
        }).end();
    });
}

async function caller () {
    try {
        let result = await getNasaDataService();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

caller();