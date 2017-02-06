var Consts = require('./constants.js');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');

var searchPath = '/peaks/ac_location_name/?query=';
var catchPath = '/peaks/catch';

Fetch = function() {};

Fetch.findPeak = function(query, cb) {
  var url = Consts.BASE_URL + searchPath + encodeURIComponent(query);
  request(url, function(err, response, body) {
    if (err) {
      return cb(err);
    }

    try {
      var results = JSON.parse(body.replace(/'/g, '"'));
      if (results.length > 0) {
        cb(undefined, results[0]);
      } else {
        cb(new Error("No results found"));
      }
    }
    catch (e) {
      return cb(new Error("Could not parse response body to JSON"));
    }
  });
};

Fetch.getPeakUrl = function(id, name, cb) {
  var url = Consts.BASE_URL + catchPath;
  var options = {
    url: url,
    form: {
      "query": name,
      "loc_id": id,
      "action": "save"
    }
  }
  request.post(options, function(err, response, body) {
    if (err) {
      return cb(err);
    }

    return cb(undefined, response.headers['location']);
  });
};

Fetch.getPeakElevations = function(url, cb) {
  request(url, function(err, response, body) {
    if (err) {
      return cb(err);
    }

    var $ = cheerio.load(body);
    var anchors = $('ul.elev>li>a');

    if (anchors.length > 0) {
      var elevations = [];
      anchors.each(function(i, elem){
        elevations.push($(elem).attr('href'));
      });
      return cb(undefined, elevations);
    } else {
      return cb(new Error('Could not find forecast elevation links'));
    }
  });
};

  Fetch.getForecastHtml = function(url, cb) {
    request(url, function(err, response, body) {
      if (err) {
        return cb(err);
      }

      return cb(undefined, body);
    });
};

module.exports = Fetch;
