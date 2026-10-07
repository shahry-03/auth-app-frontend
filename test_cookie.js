const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(req.headers.cookie || 'no cookie');
});
server.listen(8081, () => {
  fetch("http://localhost:8081", {
    headers: {
      Cookie: "refresh_token=123"
    }
  }).then(r => r.text()).then(t => {
    console.log("Server received:", t);
    server.close();
  });
});
