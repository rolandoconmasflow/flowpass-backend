const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', path: req.url, env: process.env.NODE_ENV }));
});
const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`Server listening on port ${port}, NODE_ENV=${process.env.NODE_ENV}`));
