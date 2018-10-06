require('dotenv').config()
const octokit = require('@octokit/rest')();

var wrapper = {

  authenticate: () => {
    octokit.authenticate({
      type: 'token',
      token: process.env.GITHUB_TOKEN
    })},

  getCommits: (owner, repo) => {
      octokit.repos.getCommits({ owner: owner, repo: repo }, (error, result) => {
      console.log(result);
    })}
}

module.exports = wrapper;
