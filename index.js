var consts = require('./constants.js');
var Fetch = require('./fetch.js');
var Response = require('./response.js');
var Weather = require('./weather.js');
var Post = require('./post.js');
var express = require('express');
var bodyParser = require('body-parser')
var multer = require('multer'); // v1.0.5
var app = express();
var upload = multer(); // for parsing multipart/form-data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

consts.getApiKey(function(key) {
  // validate key
});

app.set('port', (process.env.PORT || 5000));

var response;

app.get('/'), function(req, res) {
  res.sendStatus(200);
};

app.post('/', upload.array(), function(req, res) {
  res.sendStatus(200);
  var query = req.body.text;
  var responseUrl = req.body.response_url;

  Fetch.findPeak(query, function(err, mountain){
    if (err) {
      response = new Response(Response.ERROR);
      console.log(JSON.stringify(response.generate()));
      Post(responseUrl, response.generate());
      return;
    }

    var id = mountain[0];
    var name = mountain[1];
    var country = mountain[2];
    Fetch.getPeakUrl(id, name, function(err, url){
      if (err) {
        response = new Response(Response.ERROR);
        response.setErrorMessage('I found a result for ' + name + ', but somehow I can\'t get to it.');
        response.setErrorDetail(err.message);
        console.log(JSON.stringify(response.generate()));
        Post(responseUrl, response.generate());
        return;
      }

      Fetch.getPeakElevations(url, function(err, elevations){
        if (err || elevations.length == 0) {
          response = new Response(Response.ERROR);
          response.setErrorMessage('I found ' + name + ', but I can\'t find a forecast for it.');
          if (err) {
            response.setErrorDetail(err.message);
          }
          console.log(JSON.stringify(response.generate()));
          Post(responseUrl, response.generate());
          return;
        }

        var forecastUrl = consts.BASE_URL + elevations[0];
        var altitude = elevations[0].split('/');
        altitude = altitude[altitude.length - 1];
        Fetch.getForecastHtml(forecastUrl, function(err, html) {
          if (err) {
            response = new Response(Response.ERROR);
            response.setErrorMessage('I could not get the forecast for ' + name + '.');
            response.setErrorDetail(err.message);
            console.log(JSON.stringify(response.generate()));
            Post(responseUrl, response.generate());
            return;
          }

          var weather = new Weather(html);

          response = new Response(Response.SUCCESS);
          response.setUrl(forecastUrl);
          response.setName(name);
          response.setCountry(country);
          response.createGenericMessage();
          response.attachWeather(weather, altitude);

          var json = JSON.stringify(response.generate());
          console.log(json);
          Post(responseUrl, response.generate());
        });
      });
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
