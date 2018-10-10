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
      octokit.repos.getCommits({ owner: owner, repo: repo }, (error, result) => {
        let commits = result.data.map(commit => {
          return {
                    message: commit.commit.message,
                    name: commit.commit.author,
                    url: commit.commit.url,
                    sha: commit.commit.tree.sha
                  }
        })

        // if ('./data/commits.json') {
        //   console.log('hello');
        // }

        fs.readFile('./data/commits.json', (err, data) => {
          if (err) throw err;
          data = JSON.parse(data);
          console.log(data);
          commits.forEach(commit => {
            if (!data.inculdes(commit)) {
              data.push(commit);
            }
          })
        })

        fs.writeFile('./data/commits.json', JSON.stringify(commits), err => { if (err) throw err; })
    })}
}

module.exports = wrapper;
