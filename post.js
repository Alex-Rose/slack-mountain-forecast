var request = require('request');

Post = function(url, body, cb) {
  var options = {
    uri: url,
    method: 'POST',
    json: body
  };

  request(options, function (error, response, body) {
    if (error) {
      console.log(error.message);
    } else if (response.statusCode != 200) {
      console.log('HTTP ' + response.statusCode);
      console.log(body);
    }
  });
};

module.exports = Post;
