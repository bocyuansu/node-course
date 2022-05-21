// read stock no from mysql database

const axios = require('axios');
// mysql2 是一個第三方套件
// npm i mysql2
// 引用進來
const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');
// dotenv.config();
require('dotenv').config();

(async () => {
  // console.log('DB_HOST', process.env.DB_HOST);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  let [data, fields] = await connection.execute('SELECT * FROM stocks');
  // console.log(data);

  let mapResult = data.map(async (stock, i) => {
    // console.log(stock);
    let response = await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
        params: {
            response: 'json',
            date: '20220301',
            stockNo: stock.id,
        },
    });
    // 被 async 包起來，return 會是 Promise
    return response.data;
  });
  // console.log(mapResult); 會是 Promise <pending>

  let priceResults = await Promise.all(mapResult);
  console.log(priceResults);

  connection.end();
})();
