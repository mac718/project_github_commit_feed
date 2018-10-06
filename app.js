const wrapper = require('./lib/wrapper');
const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.statusMessage = 'Not Found';
      throw err;
    } else {  
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    }
  })
})

server.listen(3000, 'localhost', () => {
  console.log('listening bitch');
});