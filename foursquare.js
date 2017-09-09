var request = require('request'),
    config = require('config'),
    client_id = config.get('Foursquare.CLIENT_ID'),
    client_secret = config.get('Foursquare.CLIENT_SECRET');

foursquareAPI = function(lat, long, callback) {
  var base = 'https://api.foursquare.com/v2/venues/search?ll=';
  base = base.concat(lat, ',', long);
  base = base.concat('&categoryId=4bf58dd8d48988d1f9941735&radius=50000&client_id=');
  base = base.concat(client_id, '&client_secret=', client_secret, '&v=20170908');
  request(base, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(body);
      }
      else {
        callback(null);
      }
  });
}

var foursquare = module.exports.foursquareAPI;

// foursquareAPI(39.9,-75.2, function(ans) {
//   console.log(ans);
// });
