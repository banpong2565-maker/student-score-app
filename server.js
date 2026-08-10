const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const base = path.resolve(__dirname);

http.createServer((req, res) => {
  let filePath = path.join(base, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
  };
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream'});
      res.end(data);
    }
  });
}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
