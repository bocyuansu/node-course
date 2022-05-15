const fs = require('fs/promises');

// 會回傳給你一個 promise 物件，很像 readfile-promise2 裡的 getReadfilePromise
(async () => {
    try {
        let result = await fs.readFile('test.txt', 'utf-8');
        console.log(`讀取成功 : ${result}`);
    } catch (err) {
        console.log(`發生錯誤 : ${err}`)
    }
})();
