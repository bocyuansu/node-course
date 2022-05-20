const axios = require("axios");
const fs = require("fs/promises");

// 參考 廖振景 crawler3-await-getFileName-promises.js
async function getStockInformation(stockName, stockDate) {
    try {
        let url = "https://www.twse.com.tw/exchangeReport/STOCK_DAY";
        let stockNo = await fs.readFile(stockName, "utf-8");
        let response = await axios.get(url, {
            params: {
                response: "json",
                date: stockDate,
                stockNo: stockNo,
            },
        });
        console.log(`股票標題 ： ${response.data.title}`);
        console.log(`開盤日期 ： ${response.data.date}`);
    } catch (e) {
        console.error("資料獲取錯誤 : " + e);
    }
}

(async() => {
    try {
        // 呼叫名稱日期
        await getStockInformation("stock.txt", "20220301");
        await getStockInformation("stock.txt", "20220302");
        await getStockInformation("stock.txt", "20220303");
        await getStockInformation("stock.txt", "20220304");
    } catch (e) {
        console.error("資料獲取錯誤 : " + e);
    }
})();
