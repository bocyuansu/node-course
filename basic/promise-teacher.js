// Promise 是一個表示非同步運算的最終完成或失敗的『物件』。

// Promise 有三種狀態：
  // 未決議(pending)
  // 已決議(resolved)
  // 已拒絕(rejected)

// 生成Promise的方式：
  // new Promise()
  // Promise.resolve()
  // Promise.reject()


// 在 promise 例項上呼叫 then 或 catch 方法也會生成 promise 物件，故可進行 promise 鏈

// 1. 非同步
// 2. 「最終」成功、「最終」失敗
// 3. 物件 --> new Promise();

// -> 用來解決 callback hell

// new Promise(executor);
// new 的時候要傳入 executor --> executor 也只是一個函式

// function executor(resovle, reject) {
//   // 非同步工作
//   // 做成功的時候，你就呼叫 resolve
//   // 做失敗的時候，你就呼叫 reject
// }

let dt = new Date();
console.log(`起床了 at ${dt.toISOString()}`);

let doWork = function (job, timer) {
  return new Promise((resolve, reject) => {
    // 做非同步工作
    setTimeout(() => {
      let dt = new Date();
      let result = `完成工作: ${job} at ${dt.toISOString()}`;
      resolve(result); // 執行成功 -> 一開始 PromiseValue: undefined 過數秒後 PromiseValue: result
      // reject('故意失敗'); // 執行失敗 -> PromiseValue: '故意失敗'
      // 程式碼如果出現錯誤，也代表 promise 做出了 reject 決議 -> reject(錯誤訊息); 並且不會繼續往下執行
      // 多次呼叫 resolve 並不會覆寫，只會決議第一個 resolve
    }, timer);
  });
};

// 結論：promise 一旦決議，即由peding狀態變為 resolve 或 reject 狀態，其狀態及值就不會再次改變。
// 這點保證了，後續在同一個 promise 上呼叫 then 方法註冊的回撥函式都將收到相同的結果

// 刷牙 (3000) -> 吃早餐 (5000) -> 寫功課 (3000)
let doBrushPromise = doWork('刷牙', 3000);
// console.log(doBrushPromise);  // => Promise { <pending> }
// doBrushPromise.then(處理成功的函式, 處理失敗的函式)
doBrushPromise
  .then((result) => {
    // 這邊就接到「刷牙」成功的結果
    console.log(result);

    let doEatPromise = doWork('吃早餐', 5000); 
    // 5秒後 PromiseStatus: "resolved" , PromiseValue: 完成工作: 刷牙 at Date
    return doEatPromise; // return Promise.resolve(doEatPromise)
  })
  .then((result) => {
    // 這邊就接到「吃早餐」成功的結果
    console.log(result);

    let doHWPromise = doWork('寫功課', 3000);
    return doHWPromise;
  })
  .then((result) => {
    // 這邊就接到「寫功課」成功的結果
    console.log(result);
    // 無 return -> 相當於呼叫了 return Promise.resolve(undefined)
    // PromiseStatus: "resolved" , PromiseValue: undefined
  })
  .catch((error) => {
    // 在此之前發生的錯誤，都可以在這裡被捕捉
    console.error('發生錯誤，現在在 catch', error);
  })
  .finally(() => {
    console.log('這裡是 finally');
  });

// Promise chain
// 呼叫 then 方法 也會生成 Promise
// 新的 promise 的值和狀態 取決於 then() 方法中的 回傳值
// 1. 無 return -> 相當於呼叫了 return Promise.resolve(undefined)
// 2. return 非 promise、非 thenable 值
// return 123 相當於呼叫了 return Promise.resolve(123)
// 3. return promise or thenable
// thenable: 有 then 函式的物件
  // var o = {
  //   then：function(resolve) {
  //       resolve(123)
  //   }
  // }

  // var o = {
  //   then: function(resolve, reject) {
  //       reject(456)
  //   }
// 4. return promise => return Promise.resolve(promise)

// then 的預設值
  // var p1 = Promise.resolve(123)
  // p1.then(null, null)

  // p1.then((result) => {
  //   return Promise.resolve(result);
  // },
  // (error) => {
  //   return Promise.reject(error);
  // })
