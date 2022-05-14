try {
  console.log('try');

  // ...
  // 只要有任何一行程式碼發生問題，就跳到 catch()

} catch (err) {
  console.log(err);
} finally {
  // 不管成功或失敗，都會執行
}