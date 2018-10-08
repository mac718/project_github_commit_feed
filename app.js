const wrapper = require('./lib/wrapper');
const http = require('http');
const url = require('url');
const fs = require('fs');
const commitFeed = require('./data/commits.json');

var _extractParams = (req) => {
  let urlObj = url.parse(req.url);
  let params = urlObj.query.split('&');
  params = params.map(param => {
    splitParam = param.split('=');
    param = new Object();
    param[splitParam[0]] = splitParam[1];
    console.log(param);
    return param;
  });
  return params; 
}

const server = http.createServer((req, res) => {
  _extractParams(req);

  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.statusMessage = 'Not Found';
      throw err;
    } else {  
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      let dummyFeed = JSON.stringify(commitFeed, null, 2);
      let body = data.toString().replace("{{commitFeed}}", dummyFeed);
      res.end(body);
    }
  })
})

server.listen(3000, 'localhost', () => {
  console.log('listening');
});