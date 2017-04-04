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

นั่น คือ การใช้ `then() => ...` เพื่อแปลง แต่ละ promise status ที่ได้มาให้ทำงานตามลำดับ เมื่อถึงตรงนี้ เราสามารถแปลง async => sync ได้แล้ว

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

await คือ object ที่จะใช้กับ function ที่ return promise object หรือ asynchronous function ออกมาเท่านั้น 
และเมื่อใดก็ตามเราใช้ await หน้า function ใดๆ มันจะรอให้บรรทัดนั้นเสร็จก่อน ถึงจะทำคำสั่งในบรรทัดถัดไป

และกฏของ await จะใช้ได้ต้องอยู่ภายใน promise function หรือ ภายใต้ฟังก์ชั่น ที่ประกาศตัวเป็น async เท่านั้น

## วิธีการเขียนที่กระชับขึ้น ด้วยการเริ่มต้นใหม่กับ async/await
จากตัวอย่างข้างบนเป็นตัวอย่างของการใช้ Promise ร่วมกับ Async/Await (ซึ่งผมมองว่ามันไม่ clean) จะเห็นได้ว่ามันอาจสร้างความสับสนพอสมควร ดังนั้น ในตัวอย่างนี้ผมจะอธิบายตั้งแต่พื้นฐานจนไปถึงวิธีการสร้าง ที่ง่ายๆ ชัดเจน

1. เริ่มต้นที่การประกาศ async หน้า function ที่ต้องการประกาศเป็น asynchronous หรือ return promise

[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

การวาง async หน้าฟังก์ชั่นใดๆจะ return Promise<any> โดยปริยาย

```javascript
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
```

2. Resolve, Reject and Pending / Fulfill จะรู้ได้อย่างไร
ด้วยความที่เราไม่เขียนด้วย keyword Promise ดังนั้นสิ่งที่เราต้องทำนั่นคือ 
การ ทำ Error handling `try..catch` สิ่งที่ return ใน try คือ สถานะ Resolve() และ สิ่งที่ return ใน catch คือ Reject()

3. Await เมื่อต้อการผลลัพธ์ของ Promise หรือ การทำ Resolve value จาก Promise และมันจะหยุดรอ ก่อนไปบรรทัดถัดไป

[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)

เมื่อใดก็ตามที่เราต้องการ await หรือ การหยุดรอ เพื่อไปต่อ เราต้อง ทำตามกฏ ดังนี้

- เราจะใช้ await ได้ก็ต่อเมื่อ เรียกใช้ ใน async เท่านั้น
- await จะหยุดรอ ดังนั้น การแก้ callback hell จึงนิยม มากขึ้นเรื่อยๆ แทนที่ Promise keyword
- await จะให้ผลลัพธ์ Resolve value ที่ได้จาก promise object

## สรุป
- Async/await คือ แนวทางการเขียน Asynchronous code รูปแบบใหม่ ใน ES7
- ทางเลือกเก่าของการเขียน Asynchronous code คือ `callback` หรือ `return new Promise()`
- Async ยังคง return promise object
- `try..catch` มีบทบาทในการกำหนด `promise status resolve or reject`
- เวลาสัมภาษณ์ก็ตอบเขาแบบเท่ๆว่า non-blocking I/O 
- Await คือ การหยุดรอ เพื่อ Resolve promise ให้เสร็จ ก่อนไปบรรทัดถัดไป
- Await เป็น blocking I/O แต่ก็ได้ผลลัพธ์ Synchronous code

## ตัวอย่างที่น่าสนใจ
[https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9)

