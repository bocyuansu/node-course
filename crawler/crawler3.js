// await version
// 1. read stock no from file (fs)
// 2. axios.get to request data

// npm i axios
const axios = require('axios');
const fs = require('fs');

let p = new Promise((resolve, reject) => {
	fs.readFile('stock.txt', 'utf-8', (err, stockNo) => {
		if (err) {
			reject(err);
		} else {
			resolve(stockNo);
		}
	});
}); // 一定要加分號，不然會報錯

(async () => {
	try {
		let stockNo = await p;
		console.log('read stock no from file:', stockNo);
		return (
			axios
      .get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
        params: {
          // 設定 query string
          response: 'json',
          date: '20220301',
          stockNo: stockNo,
        },
      })
      .then((response) => {
        // response 物件
        console.log(response.data);
      })
      .catch((e) => {
        console.error(e);
      })
		);
	} catch (e) {
		console.error('read file error', e);
	}
})();
