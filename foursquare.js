var request = require('request'),
    config = require('config'),
    client_id = config.get('Foursquare.CLIENT_ID'),
    client_secret = config.get('Foursquare.CLIENT_SECRET'),
    MongoClient = require('mongodb').MongoClient,
    async = require('async');

foursquareAPI = function(lat, long) {
  return new Promise((resolve, reject) => {
    var base = 'https://api.foursquare.com/v2/venues/search?ll=';
    base = base.concat(lat, ',', long);
    base = base.concat('&categoryId=4bf58dd8d48988d1f9941735&radius=50000&client_id=');
    base = base.concat(client_id, '&client_secret=', client_secret, '&v=20170908');
    request(base, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var shops = JSON.parse(body).response.venues,
              structuredRes = [],
              url = 'mongodb://localhost:27017/test';

          MongoClient.connect(url, function(err, db) {
            if (err) {
              reject('Mongo Driver errored');
            }

            var calls = [];

            for (var i = 0; i < shops.length; i++) {
              let current = shops[i];

              calls.push(function(callback) {
                db.collection('grocers').findOne({'lat': current.location.lat, 'long': current.location.lng}, function(err, query) {
                  structuredRes.push({
                    'name': current.name,
                    'latitude': current.location.lat,
                    'longitude': current.location.lng,
                    'type': 'grocer',
                    'status': (err || query === null) ? 'functional' : query.status
                  });
                  callback();
                });
              });
            }

            async.parallel(calls, function(asyncErr) {
              if (asyncErr) {
                reject('Grocer query errored');
              }

              db.close();
              resolve(structuredRes);
            });
          });
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
