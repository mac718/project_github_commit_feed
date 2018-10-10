const wrapper = require('./lib/wrapper');
const http = require('http');
const url = require('url');
const fs = require('fs');
var commitFeed = require('./data/commits');


var _extractParams = (req) => {
  let urlObj = url.parse(req.url);
  let params = urlObj.query.split('&');
  params = params.map(param => {
    splitParam = param.split('=');
    param = new Object();
    param[splitParam[0]] = splitParam[1];
    return param;
  });
  //console.log(params);
  return params; 
}

const server = http.createServer((req, res) => {
  console.log(req.url);
  if (req.url != '/'){
    let params = _extractParams(req);
    wrapper.authenticate();
    wrapper.getCommits(params[0].name, params[1].repo)
  }

  
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