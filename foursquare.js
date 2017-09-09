var request = require('request'),
    config = require('config'),
    client_id = config.get('Foursquare.CLIENT_ID'),
    client_secret = config.get('Foursquare.CLIENT_SECRET');

foursquareAPI = function(lat, long, callback) {
  return new Promise((resolve, reject) => {
    var base = 'https://api.foursquare.com/v2/venues/search?ll=';
    base = base.concat(lat, ',', long);
    base = base.concat('&categoryId=4bf58dd8d48988d1f9941735&radius=50000&client_id=');
    base = base.concat(client_id, '&client_secret=', client_secret, '&v=20170908');
    request(base, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var shops = JSON.parse(body).response.venues;
          var structuredRes = [];
          for (var i = 0; i < shops.length; i++) {
            let current = shops[i];
            structuredRes.push({
              'name': current.name,
              'latitude': current.location.lat,
              'longitude': current.location.lng,
              'type': 'grocer'
            });
          }
          resolve(structuredRes);
        }
        else {
          reject('Foursquare API errored');
        }
    });
  });

}

exports.foursquare = foursquareAPI;

// foursquareAPI(39.9,-75.2).then(function(res) {
//   console.log(res);
// });
