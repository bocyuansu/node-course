// 刷牙 (3000) -> 吃早餐 (5000) -> 寫功課 (3000)

let dt = new Date();
console.log(`起床了 at ${dt.toISOString()}`);

let doWork = function (job, timer, cb) {
  setTimeout(() => {
    let dt = new Date();
    let result = `完成工作: ${job} at ${dt.toISOString()}`;
    cb(result);
  }, timer);
  // return
  // console.log(`在 setTimeout 之後 ${job}`);
};

doWork("刷牙", 3000, function (result) {
  console.log(result);
});

setTimeout(() => {doWork("吃早餐", 5000, function (result) {
  console.log(result);
})},3000);

setTimeout(() => {doWork("寫功課", 3000, function (result) {
  console.log(result);
})},8000);
