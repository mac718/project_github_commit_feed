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
    req.body = JSON.parse(body.slice(8));
    done();
  });
}

const server = http.createServer((req, res) => {
  let path = url.parse(req.url).pathname;

  if (path === '/') {
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
  } else if (path === '/commit') {
    fs.readFile('./public/index.html', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.statusMessage = 'Not Found';
        throw err;
      } else {  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        commitFeed = JSON.stringify(require('./data/commits'), null, 2);
        let body = data.toString().replace("{{commitFeed}}", commitFeed);
        res.end(body);
      }
    })
  } else if (path === '/github/webhooks') {
    let p = new Promise(resolve => {
      _extractPostData(req, resolve);
    })
    p.then(() => {
      let webhookData = req.body;
      let userName = webhookData.pusher.name;
      let repo = webhookData.repository.name;

      console.log(webhookData);
    })
  } else {
    res.statusCode = 404;
    res.statusMessage = 'Not Found';
  };
});

//   console.log(url.parse(req.url).pathname);
//   if (url.parse(req.url).pathname == '/github/webhooks') {
    
//   }
//   let commitFeed;
//   if (url.parse(req.url).pathname != '/'){
    
//   } else {
    
//   }
// })

server.listen(3000, 'localhost', () => {
  console.log('listening');
});