const fs = require('fs/promises');

(async () => {
  try {
    let p = await fs.readFile('test.txt', 'utf-8');
    console.log(`讀取成功 : ${p}`);
  } catch (err) {
    console.log(`發生錯誤 : ${err}`)
  }
})();
