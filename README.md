# GGEZ promise async await

เพราะในโลก JavaScript นั้นไม่ใช่ทุ่งลาเวนเดอร์ ที่การแสดงผลของโค๊ดจะเรียงลำดับ 1 2 3 .. N ตามลำดับ 
เพราะ โลกนี้ไม่ได้มีแค่ Synchronous แต่มันมี Asynchronous ด้วย

ยกตัวอย่าง `setTimeout();` มันก็ทำให้โค๊ดเราเป็น `async` แล้วเราแก้ไขปัญหายังไง บางคนชอบใช้ callback 
บางคนถึงขั้น ชอบใช้ซ้อนกันหลายชั้น ผลที่ตามมา คือ callback hell !! ลองหาอ่านดูเองว่าความโหดร้ายของมันมีมากแค่ไหน

แล้วแก้ไขปัญหายังไงหล่ะ ยุคแรก timeline มันเรียงงี้เว้ย
1. Nested callback (callback hell)
2. Promise
3. Async/Await

แต่วันนี้ จะมายกตัวอย่าง 2 และ 3

## เริ่มจาก Promise
สังเกตุที่ keyword `new Promise()` คือ การบอกว่า เราจะคืน promise object จากฟังก์ชัน `getNasaDataService()` แน่นอนว่า promise object จะให้คำมั่นสัญญาว่า "เราจะคืนสถานะให้นายแน่นอน ไม่ว่าจะเป็น pending, fulfill (resolve) และ reject นะ" ไม่ต้องห่วง

พอเรารู้อนาคตว่า promise เนี่ย ส่งสถานะมาแน่ๆ เราสามารถนำความสามารถของมัน มาทำสิ่งที่เรียกว่า promise chain ได้

นั่น คือ การใช้ `then() => ...` เพื่อแปลง แต่ละ promise status ที่ได้มาให้ทำงานตามลำดับ เมื่อถึงตรงนี้ เราสามารถแปลง async => aync ได้แล้ว

```javascript
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
```

เพิ่มเติม promise ไม่ได้มีการทำงานแบบ promise chain style เพียงอย่างเดียว ยังมีเพื่อนๆของมันอีก ได้แก่

[Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
การทำงานของรูปแบบนี้ คือ ให้ async function ทำงานแบบ parallel และเมื่อใดก็ตามที่ async function ตัวใดก็ตามเสร็จ callback ที่กำหนดไว้จะทำงานทันที ไม่รอให้ async function ที่เหลือเสร็จทั้งหมด

[Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
การทำงานของรูปแบบนี้ คือ ให้ async function ทำงานพร้อมกันแบบคู่ขนาน parallel และ รอให้ทุกเคสเสร็จครบ จึงจะทำ callback ที่กำหนดไว้ในลำดับถัดไป หรือ สุดท้าย

## นี่หมดยุค 2017 ละ ใครเขาใช้ Promise กัน ถถถ+
ที่มาของ การใช้ async/await syntax คือ promise มันอ่านยาก หลายขั้นตอน จึงมีคนคิด มีแนวทางไหมที่อยากได้ผลลลัพธ์แบบ promise แต่เขียนได้กระชับ และสั้นกว่า

```javascript
let request = require('request');
const _nasaJSON = 'https://data.nasa.gov/resource/q83n-bbjy.json';

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

async function caller () {
    try {
        let result = await getNasaDataService();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

caller();
```

await คือ object ที่จะใช้กับ function ที่ return promise object ออกมาเท่านั้น และเมื่อใดก็ตามเราใช้ await หน้า function ใดๆ มันจะรอให้บรรทัดนั้น และ statement นั้นๆให้เสร็จก่อน ถึงจะทำคพสั่งในบรรทัดถัดไป

และกฏของ await จะใช้ได้ต้องอยู่ภายใน promise function หรือ ภายใต้ฟังก์ชั่น ที่ประกาศตัวเป็น async เท่านั้น

## วิธีการเขียนที่กระชับขึ้น

