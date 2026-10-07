const http = require('http');

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    console.log(req.method, req.url);
    console.log(req.headers);
    console.log(body);
    res.writeHead(200);
    res.end();
  });
});
server.listen(8081, () => {
  fetch("http://localhost:8081/api/v1/auth/refresh", {
    method: "POST",
    headers: {
      Cookie: `refresh_token=fake_token`,
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      "X-Forwarded-For": "127.0.0.1"
    },
    body: JSON.stringify({})
  }).then(() => server.close());
});
