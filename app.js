const wrapper = require('./lib/wrapper');
const http = require('http');
const url = require('url');
const fs = require('fs');
//var commitFeed = require('./data/commits');


var _extractParams = (req) => {
  let urlObj = url.parse(req.url);
  let params = urlObj.query.split('&');
  params = params.map(param => {
    splitParam = param.split('=');
    param = new Object();
    param[splitParam[0]] = splitParam[1];
    return param;
  });
  return params; 
}

const server = http.createServer((req, res) => {
  console.log(req.url);
  let commitFeed;
  if (req.url != '/'){
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
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          console.log('butts');
          //commitFeed = JSON.stringify(commitFeed, null, 2);
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