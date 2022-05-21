const http = require('http');

const server = http.createServer((request, response) => {
  // 當你的 server 接收到 request 的時候要做什麼事
  response.end('hello server');
});

server.listen(3001, () => {
  console.log('Server running at port 3001')
});