var request = require('request');

var options = {
  baseUrl: 'https://your-site.atlassian.net/wiki/rest/api',
  auth: { username: process.env.CONFLUENCE_USERNAME, password: process.env.CONFLUENCE_PASSWORD },
  headers: {
    Accept: 'application/json'
  }
};

request.get('/space?label=community', options, spaces);

function spaces(error, response, body) {
  if (error) throw new Error(error);
  if (response.statusCode != 200) {
    console.log('Response: ' + response.statusCode + ' ' + response.statusMessage);
  }
  var spaces = JSON.parse(body);
  spaces.results.map(space => {
    spacePages(space);
  });
}

function spacePages(space) {
  request.get(`/search?cql=space=${space.key} AND type IN (page,blogpost)`, options, pages);

  function pages(error, response, body) {
    if (error) throw new Error(error);
    if (response.statusCode != 200) {
      console.log('Response: ' + response.statusCode + ' ' + response.statusMessage);
    }
    pages = JSON.parse(body);
    //console.log(pages);
    console.log(`${space.name}, ${pages.totalSize}`);
  }
}
