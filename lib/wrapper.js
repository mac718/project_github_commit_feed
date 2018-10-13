require('dotenv').config()
const octokit = require('@octokit/rest')();
const fs = require('fs');

var wrapper = {

  authenticate: () => {
    octokit.authenticate({
      type: 'token',
      token: process.env.GITHUB_TOKEN
    })},

  getCommits: (owner, repo) => {
    return new Promise( (resolve, reject) => {
      octokit.repos.getCommits({ owner: owner, repo: repo }, (error, result) => {
        let commits = result.data.map(commit => {
          return {
                    message: commit.commit.message,
                    name: commit.commit.author,
                    url: commit.commit.url,
                    sha: commit.commit.tree.sha
                  }
        })

        fs.readFile('./data/commits.json', (err, data) => {
          if (err) {
            fs.writeFile('./data/commits.json', JSON.stringify(commits), err => { 
              if (err) {
                reject(err); 
              } else {
                fs.readFile('./data/commits.json', (err, data) => {
                  resolve(JSON.stringify(JSON.parse(data)));
                })
              }
            })
          } else {
            let info = JSON.parse(data)

            commits.forEach(commit => {
              let match = false;
              
              info.forEach(infoCommit => {
                if (commit.sha == infoCommit.sha) {
                  match = true;
                }
              })
              
              if (match == false) {
                info.push(commit);
              } 
            })

            fs.writeFile('./data/commits.json', JSON.stringify(info), err => {
              fs.readFile('./data/commits.json', (err, data) => {
                resolve(data);
              })
            })           
          }
        })  
      })
    })
  }
}

module.exports = wrapper;
