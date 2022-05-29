// npm i express
// 導入 express 這個模組
const express = require('express');
// 利用 express 來建立一個 express application
const app = express();

const path = require('path');

// 使用第三方開發的中間件 cors
const cors = require('cors');
app.use(cors());

const mysql = require('mysql2');
require('dotenv').config();

// 這裡不會像爬蟲那樣，只建立一個連線
// 但是，也不會幫每一個 request 都分別建立連線
// ----> connection pool
// 建立資料庫連線池
let pool = mysql.createPool({
  host: process.env.DB_HOST, // 主機位置
  port: process.env.DB_PORT, // 資料庫 port
  user: process.env.DB_USER, // 資料庫帳號
  password: process.env.DB_PASSWORD, // 資料庫密碼
  database: process.env.DB_NAME, // 資料庫名稱
  // 為了 pool 新增的參數
  // 連線池可建立的總連線數上限(預設最多為10個連線數)
  connectionLimit: 10,
}).promise();

// client - server
// client send request ------> server
//                     <------ response
// request - response cycle
// client: browser, postman, nodejs,...

// express 是一個由 middleware (中間件) 組成的世界
// request --> middleware1 --> middleware2 --> .... --> response
// 中間件的「順序」很重要!!
// Express 是按照你安排的順序去執行誰是 next 的
// middleware 中有兩種結果：
// 1. next: 往下一個中間件去
// 2. response: 結束這次的旅程 (req-res cycle)

// express SSR 的做法
// 設定 express 視圖檔案放在哪裡 (此例，放在views)
app.set('views', path.join(__dirname, 'views'));
// 設定 express要用哪一種樣版引擎 (template engine)
// npm i pug
app.set('view engine', 'pug');

// extended: false --> querystring
// extended: true --> qs
app.use(express.urlencoded({ extended: true }));

// express 處理靜態資料
// 靜態資料: html, css 檔案, javascript 檔案, 圖片, 影音檔...
// express 少數內建的中間件 static
// path.join(路徑, 資料夾名稱) 
// __dirname = C:\Users\iii_student\Desktop\node-course\simple-express
// 方法1: 不要指定網址
app.use(express.static(path.join(__dirname, 'assets')));
// http://localhost:3001/images/test1.jpg
// 方法2: 指定網址 aaa
app.use('/aaa', express.static(path.join(__dirname, 'public')));
// http://localhost:3001/aaa/images/callback-hell.png

// 一般中間件
app.use((request, response, next) => {
  console.log('我是一個沒有用的中間件 AAAA');
  next(); // 跳到下一個中間件

  // 兩個都有，那會發生什麼事？
  // 情況 1:
  // next();
  // response.send('我是中間件');
  
  // 情況 2:
  // response.send('我是中間件');
  // next();
});

app.use('/test',(request, response, next) => {
  console.log('我是一個沒有用的中間件 BBBB');
  next();
  // return
});

// HTTP request 
// method: get, post, put, delete, ...
// 路由中間件 (會比對網址)
app.get('/', (request, response, next) => {
  // 送回 response，結束了 request-response cycle
  // 如果沒有 response ，前端就會一直在等回覆(轉圈)
  response.send('首頁');
  // return
});

app.get('/about', (request, response, next) => {
  response.send('About me');
});

app.get('/error', (req, res, next) => {
  // 發生錯誤，你丟一個錯誤出來
  // throw new Error('測試測試');
  // 或是你的 next 裡有任何參數
  next('我是正確的');
  // --> 都會跳去【錯誤處理中間件】
})

// Server - side - rendering
app.get('/ssr', (req, res, next) => {
  // 會去 views 檔案夾裡找 index.pug
  // 第二個參數: 資料物件，會傳到 pug 那邊去，pug 可以直接使用
  res.render('index', {
    stocks: ['台積電', '長榮', '聯發科'],
  });
});

// RESTful API
// 取得 stocks 的列表
app.get('/stocks', async (req, res, next) => {
  // 撈資料庫的資料
  let [data, fields] = await pool.execute("SELECT * FROM stocks");
  // data 會是一個 陣列 
  res.json(data);
});

// (使用路由中間件) 取得某個股票 id 的資料
app.get('/stocks/:stockId', async (req, res, next) => {
  // :stockId 代表設定 stockId 參數
  // 取得網址上的參數 req.params
  // 可以透過 req.params.stockId 取得 2330
  console.log('get stocks by stockId', req.params);
  // pool.execute 可以防止 SQL injection
  // console.log('query stock by id:', data);

  // RESTful 風格之下，鼓勵把這種過濾參數用 query string 來傳遞
  // /stocks/:stockId?page=1&year=2022
  // req.query = {page:1, year:2022}
  // 1. 取得目前在第幾頁，而且利用 || 這個特性來做預設值
  // req.query = {} -> 透過 ? 宣告 的 變數
  // 如果網址上沒有 page 這個 query string，那 req.query.page 會是 undefined
  // undefined 會是 false，所以 page 就被設定成 || 後面的數字
  console.log('req.query:', req.query);
  
  let page = req.query.page || 1; // 如果沒有宣告 page，則預設 page = 1
  console.log('current page', page);

  // 2. 取得目前的總筆數
  // 執行 SQL 語法 -> pool.execute( SQL語法 ) 
  let [allResults, fields] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ?', [req.params.stockId]);
  // pool.execute 會回傳兩個陣列，第一個陣列裝資料，第二個陣列通常用不到
  const total = allResults.length; // 資料總筆數 = 陣列長度
  console.log('total:', total);

  // 3. 計算總共有幾頁
  // 無條件進位: Math.ceil 1.1 => 2   1.05 -> 2
  const perPage = 5; // 每一頁 顯示幾筆 資料
  const lastPage = Math.ceil(total / perPage); // 最後一頁是第幾頁
  console.log('lastPage:', lastPage);

  // 4. 計算 offset 是多少 (計算要跳過幾筆)
  // 在第五頁，就是要跳過 4 * perPage
  let offset = (page - 1) * perPage;
  console.log('offset:', offset);

  // 5. 取得當前頁面的資料 select * from table limit 顯示筆數 offset 跳過筆數
  let [pageResults] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date DESC LIMIT ? OFFSET ?', [req.params.stockId, perPage, offset]);

  // test case
  // 正面: 沒有page, page=1, page=2, page=12 (因為總共12頁)
  // 負面: page = -1, page=13, page=空白(page=1), page=a,...
  // 6. 回覆給前端
  res.json({
    // 用來儲存所有跟頁碼有關的資訊
    pagination: {
      total,
      lastPage,
      page
    },
    // 真正的資料 -> 顯示當前頁面的資料
    data: pageResults,
  })

  // 空資料(查不到資料)，有兩種處理方式：
  // 1. 200 OK 就會 [] ;
  // 2. 回覆 404
  // if(data.length === 0) {
  //   // 這裡是 404 的範例
  //   res.status(404).json(data);
  // } else {
  //   res.json(data);
  // }
})

// 這個中間件在所有路由的後面
// 會到這裡，表示前面所有的路由中間件都沒有比對到符合的網址
// => 404
app.use((req, res, next) => {
  console.log('所有路由的後面 => 404', req.path);
  res.status(404).send('Not Found');
});

// 5xx 伺服器端錯誤
// 錯誤處理中間件: 通常也會放在所有中間件的最後
// 超級特殊的中間件
// 有點接近 try-catch 的 catch
app.use((err, req, res, next) => {
  // req.path = 路徑
  console.error('來自四個參數的錯誤處理中間件', req.path, err);
  res.status(500).send('Server Error: 請洽系統管理員');
})

app.listen(3001, () => {
  console.log('Server start at 3001');
});
