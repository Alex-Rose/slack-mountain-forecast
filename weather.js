var cheerio = require('cheerio');

Weather = function(html) {
  this.html = html;
  this.dom = cheerio.load(html);
  this.parsePage();
}

Weather.prototype.parsePage = function() {
  var $ = this.dom;
  var self = this;

  this.days = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[2]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).html();
    value = value.replace('<b>', '');
    value = value.replace('</b>', '');
    value = value.trim();
    var day = {
      'count': td.attr('colspan'),
      'value': value
    };

    self.days.push(day);
  });

  this.parseTimes();
  this.parseWinds();
  this.parseSummaries();
  this.parseSnow();
  this.parseRain();
  this.parseHigh();
  this.parseLow();
  this.parseChill();
  this.parseFreezing();
};

Weather.prototype.parseTimes = function() {
  var $ = this.dom;
  var self = this;

  this.times = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[3]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).find('span').html();
    self.times.push(value);
  });
};

Weather.prototype.parseWinds = function() {
  var $ = this.dom;
  var self = this;

  this.winds = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[6]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).find('span').html();
    self.winds.push(value);
  });
};

Weather.prototype.parseSummaries = function() {
  var $ = this.dom;
  var self = this;

  this.summaries = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[7]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).html();
    value = value.trim();
    self.summaries.push(value);
  });
};

Weather.prototype.parseSnow = function() {
  var $ = this.dom;
  var self = this;

  this.snow = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[8]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).find('span').html();
    self.snow.push(value);
  });
};

Weather.prototype.parseRain = function() {
  var $ = this.dom;
  var self = this;

  this.rain = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[9]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).find('span').html();
    self.rain.push(value);
  });
};

Weather.prototype.parseHigh = function() {
  var $ = this.dom;
  var self = this;

  this.high = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[10]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).find('span').html();
    self.high.push(value);
  });
};

Weather.prototype.parseLow = function() {
  var $ = this.dom;
  var self = this;

  this.low = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[11]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).find('span').html();
    self.low.push(value);
  });
};

Weather.prototype.parseChill = function() {
  var $ = this.dom;
  var self = this;

  this.chill = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[12]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).find('span').html();
    self.chill.push(value);
  });
};

Weather.prototype.parseFreezing = function() {
  var $ = this.dom;
  var self = this;

  this.freezing = [];

  var rows = $('#forecast-cont>table>tr');

  $(rows[13]).find('td').each(function(i, item) {
    var td = $(item);
    var value = $(td).find('span').html();
    self.freezing.push(value);
  });
};

module.exports = Weather;
