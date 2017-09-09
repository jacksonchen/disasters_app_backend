var request = require('request'),
    config = require('config'),
    client_id = config.get('Foursquare.CLIENT_ID'),
    client_secret = config.get('Foursquare.CLIENT_SECRET');

foursquare = function(lat, long) {
  // Philly lat long 39.9,-75.2
  var base = 'https://api.foursquare.com/v2/venues/search?ll=';
  base = base.concat(lat, ',', long);
  base = base.concat('&categoryId=4bf58dd8d48988d1f9941735&client_id=');
  base = base.concat(client_id, '&client_secret=', client_secret, '&v=20170908');
  console.log(base);
  request(base, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          return body;
      }
      return null;
  });
}

// var foursquare = module.exports.foursquare;

console.log(foursquare(39.9, 75.2));
