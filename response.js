
Response = function(type) {
  this.type = type;
  this.errorMessage = (type == Response.ERROR ? 'Please try again with a *real* mountain this time' : '');
  this.errorDetail = '';
  this.message = '';
  this.url = undefined;
  this.name = undefined;
  this.country = undefined;
  this.attachments = [];
  this.elevations = undefined;
  this.output = {};
};

Response.prototype.generate = function() {
  if (this.type == Response.ERROR) {
    this.generateError();
  } else
  {
    this.generateAnswer();
  }

  return this.output;
};

Response.prototype.generateAnswer = function() {
  this.output['response_type'] = 'in_channel';
  this.output['text'] = this.message;

  if (this.attachments.length > 0) {
    this.output['attachments'] = this.attachments;
  };
};

Response.prototype.createGenericMessage = function() {
  if (this.url && this.name && this.country) {
    this.message = 'Weather forecast for <' + this.url + '|' + this.name + '>, ' + this.country;
  } else {
    throw new Error('URL, peak name and country values must not be undefined');
  }
};

Response.prototype.attachWeather = function(weather, altitude) {
  if (!this.elevations) {
    throw new Error('Must provide elevations');
  }

  var att = {};
  var i = 0;

  att['text'] = 'Current weather is ' + weather.summaries[i] + ' (altitude *' + altitude + ' m*)';

  var fields = [];
  fields = Response.pushNewField('Wind', weather.winds[i] + ' km/h', fields);
  fields = Response.pushNewField('Snow', weather.snow[i] + ' cm', fields);
  fields = Response.pushNewField('High', weather.high[i] + ' °C', fields);
  fields = Response.pushNewField('Low', weather.low[i] + ' °C', fields);
  fields = Response.pushNewField('Wind chill', weather.chill[i] + ' °C', fields);
  fields = Response.pushNewField('Freezing level', weather.freezing[i] + ' m', fields);
  att['fields'] = fields;
  att['mrkdwn_in'] =  ['text'];

  var actions = [];

  for (var i = 0; i < 4 && i < this.elevations.length; i++) {
    var altitude = this.elevations[i].split('/');
    altitude = altitude[altitude.length - 1];
    var style = (i == 0) ? 'primary': 'default';
    var action = {
      'name': 'elevation',
      'text': altitude + ' m',
      'type': 'button',
      'style': style,
      'value': this.elevations[i]
    }

    actions.push(action);
  }

  att['actions'] = actions;

  this.attachments.push(att);
}

Response.prototype.setMessage = function(message) {
  this.message = message;
};

Response.prototype.setUrl = function(url) {
  this.url = url;
};

Response.prototype.setName = function(name) {
  this.name = name;
};

Response.prototype.setCountry = function(country) {
  this.country = country;
};

Response.prototype.setElevations = function(elevations) {
  this.elevations = elevations;
};

Response.prototype.generateError = function() {
  this.output['response_type'] = 'in_channel';
  this.output['text'] = 'I\'m sorry, I could not find this mountain.';

  var text = this.errorMessage;
  if (this.errorDetail != '') {
    text += '\n\n_Error detail_:\n' + this.errorDetail;
  }

  this.output['attachments'] = [{
    'mrkdwn_in': ['text'],
    'color': 'danger',
    'text': text
  }];
};

Response.prototype.setErrorMessage = function (message) {
  this.errorMessage = message;
};

Response.prototype.setErrorDetail = function (message) {
  this.errorDetail = message;
};

Response.pushNewField = function(title, value, fields, short) {
  if (short == undefined) short = true;
  fields.push({
    'title': title,
    'value': value,
    'short': short
  });

  return fields;
};

Response.SUCCESS = 0;
Response.ERROR = 1;

module.exports = Response;
