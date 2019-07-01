var request = require('request');

var options = {
  baseUrl: 'https://your-site.atlassian.net/wiki/rest/api',
  auth: { username: process.env.CONFLUENCE_USERNAME, password: process.env.CONFLUENCE_PASSWORD },
  headers: {
    Accept: 'application/json'
  }
};

request.get('/group/your-group/member', options, members);

function members(error, response, body) {
  if (error) throw new Error(error);
  if (response.statusCode != 200) {
    console.log('Response: ' + response.statusCode + ' ' + response.statusMessage);
  }
  var users = JSON.parse(body);
  users.results.map(user => {
    userContributions(user);
  });
}

function userContributions(user) {
  request.get(`/search?cql=contributor="${user.username}"`, options, contributions);

  function contributions(error, response, body) {
    if (error) throw new Error(error);
    if (response.statusCode != 200) {
      console.log('Response: ' + response.statusCode + ' ' + response.statusMessage);
    }
    contributions = JSON.parse(body);
    console.log(`${user.displayName}, ${contributions.totalSize}`);
  }
}
