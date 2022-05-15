let dt = new Date();
console.log(`起床了 at ${dt.toISOString()}`);

let doWork = function (job, timer) {
  return new Promise((resolve, reject) => {
    // 做非同步工作
    setTimeout(() => {
      let dt = new Date();
      let result = `完成工作: ${job} at ${dt.toISOString()}`;
      // resolve(result); 
      reject("發生錯誤了！");
    }, timer);
  });
};

// async 裡面 才能放 await，會讓程式碼暫停，直到 非同步程式 做完 才繼續
async function main() {
  try{
    let doBrushPromise = await doWork('刷牙', 3000);
    console.log(doBrushPromise);
  
    let doEatPromise = await doWork('吃早餐', 5000);
    console.log(doEatPromise);
  
    let doHWPromise = await doWork('寫功課', 3000);
    console.log(doHWPromise);
  
  } catch (e) {
    console.log(e);
  }
}main();

// doBrushPromise
//   .then((result) => {
//     // 這邊就接到「刷牙」成功的結果
//     console.log(result);

//     let doEatPromise = doWork('吃早餐', 5000);
//     // 5秒後 PromiseState: "resolved" , PromiseResult: 完成工作: 刷牙 at Date
//     return doEatPromise; // return Promise.resolve(doEatPromise)
//   })
//   .then((result) => {
//     // 這邊就接到「吃早餐」成功的結果
//     console.log(result);

//     let doHWPromise = doWork('寫功課', 3000);
//     return doHWPromise;
//   })
//   .then((result) => {
//     // 這邊就接到「寫功課」成功的結果
//     console.log(result);
//     // 無 return -> 相當於呼叫了 return Promise.resolve(undefined)
//     // PromiseState: "resolved" , PromiseResult: undefined
//   })
//   .catch((error) => {
//     // 在此之前發生的錯誤，都可以在這裡被捕捉
//     console.error('發生錯誤，現在在 catch', error);
//   })
//   .finally(() => {
//     console.log('這裡是 finally');
//   });

