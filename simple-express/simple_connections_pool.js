// 引用MySQL函式庫
var mysql = require('mysql');
// 建立資料庫連線池
var pool  = mysql.createPool({
    user: '資料庫帳號',
    password: '資料庫密碼',
    host: '主機位置',
    port: '資料庫port',
    database: '資料庫名稱',
    // 無可用連線時是否等待pool連線釋放(預設為true)
    waitForConnections : true,
    // 連線池可建立的總連線數上限(預設最多為10個連線數)
    connectionLimit : 10
});

// 取得連線池的連線
pool.getConnection(function(err, connection) {

    if (err) 
    {
        // 取得可用連線出錯
        
    }
    else
    {
        // 成功取得可用連線
        // 使用取得的連線
        connection.query( 'SELECT something FROM sometable', function(err, rows) {
            // 使用連線查詢完資料

            // 釋放連線
            connection.release();
            // 不要再使用釋放過後的連線了，這個連線會被放到連線池中，供下一個使用者使用
        });
    }
});