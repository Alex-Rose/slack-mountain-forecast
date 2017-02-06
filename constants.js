fs = require('fs')

var API_KEY;
var BASE_URL  = 'http://www.mountain-forecast.com';
Constants = function() {
};

Constants.getApiKey = function(cb) {
  if (API_KEY !== undefined) {
    cb(API_KEY);
  } else {
    fs.readFile('api_key.secret', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      API_KEY = data.trim();
      cb(API_KEY);
    });
  }
}

Constants.BASE_URL = BASE_URL;

module.exports = Constants;
