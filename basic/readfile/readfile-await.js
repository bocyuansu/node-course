const fs = require('fs');

function getReadfilePromise(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) {
        // 錯誤了
        reject(err);
      } else {
        // 因為沒有 err，所以是正確的
        resolve(data);
      }
    });
  });
}

async function rd() {
  try{
    let rdfile = await getReadfilePromise('test.txt')
    console.log(rdfile);
  } catch (err) {
    console.log(err);
  }
}rd();
