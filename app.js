const wrapper = require('./lib/wrapper');
const http = require('http');
const url = require('url');
const fs = require('fs');
//var commitFeed = require('./data/commits');


var _headers = {
  "Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE"
}

var _extractParams = (req) => {
  let urlObj = url.parse(req.url);
  console.log(urlObj);
  let params = urlObj.query.split('&');
  params = params.map(param => {
    splitParam = param.split('=');
    param = new Object();
    param[splitParam[0]] = splitParam[1];
    return param;
  });
  return params; 
}

var _extractPostData = (req, done) => {
  let body = '';
  req.on('data', data =>{ 
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    done();
  });
}

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url).pathname);
  if (req.url == '/github/webhooks') {
    let p = new Promise(resolve => {
      _extractPostData(req, resolve());
    })
    p.then(() => {
      console.log(req.body);
    })
  }
  let commitFeed;
  if (url.parse(req.url).pathname != '/'){
    let params = _extractParams(req);
    wrapper.authenticate();
    wrapper.getCommits(params[0].name, params[1].repo).then(result => {
      console.log('promise');
      commitFeed = JSON.stringify(JSON.parse(result), null, 2);
      fs.readFile('./public/index.html', (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.statusMessage = 'Not Found';
          throw err;
        } else {  
          //res.writeHead(200, _headers);
          let body = data.toString().replace("{{commitFeed}}", commitFeed);
          res.end(body);
        }
      })
    });
  } else {
    fs.readFile('./public/index.html', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        throw err;
      } else {  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        console.log('butts');
        commitFeed = JSON.stringify(require('./data/commits'), null, 2);
        let body = data.toString().replace("{{commitFeed}}", commitFeed);
        res.end(body);
      }
    })
  }
})

server.listen(3000, 'localhost', () => {
  console.log('listening');
});