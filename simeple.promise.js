let request = require('request');
const _nasaJSON = 'https://data.nasa.gov/resource/q83n-bbjy.json';

/**
 * @description This method calls request to nasa api
 * 
 * @returns  Promise<Array<any>>
 * @returns  JSON data
 */
function getNasaDataService () {
    return new Promise((resolve, reject) => {
        request(_nasaJSON, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(body);
            }
        });
    });
}


/**
 * @description This method calls getNasaDataService();
 * 
 */
function called () {
    getNasaDataService()
    .then((response) => {
        console.log(response);
    })
    .catch((reason) => {
        console.error(reason);
    });
}

called();
