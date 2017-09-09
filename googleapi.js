var request = require('request'),
  config = require('config'),
  client_id = config.get('Google.KEY'),
  MongoClient = require('mongodb').MongoClient,
  async = require('async');

getStatus = function(lat, long, callback) {
  var url = 'mongodb://localhost:27017/test';
  MongoClient.connect(url, function(err, db) {
    if (err) {
      return callback(null);
    }

    db.collection('gas').findOne({'lat': lat, 'long': long}, function(err, query) {
      if (err || query === null) {
        return callback(null);
      }
      callback(query.status);
    });
  });
}

googleAPICall = function(lat, long){
  return new Promise((resolve, reject) => {
    var googleUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';
    googleUrl = googleUrl.concat(lat, ',', long);
    googleUrl = googleUrl.concat('&radius=25000&type=gas_station&key=', client_id);
    request(googleUrl, json = true, function (error, response, body) {
      if (error) {
        reject('Google API error');
      }
      else {
        var jsonObj = JSON.parse(body),
            structuredRes = [],
            url = 'mongodb://localhost:27017/test';

        MongoClient.connect(url, function(err, db) {
          if (err) {
            reject('Mongo Driver errored');
          }

          var calls = [];

          for (var i = 0; i < jsonObj.results.length; i++){
            let current = jsonObj.results[i];
            calls.push(function(callback) {
              db.collection('gas').findOne({'lat': current.geometry.location.lat,
                                            'long': current.geometry.location.lng}, function(err, query) {
                structuredRes.push({
                  'name': current.name,
                  'latitude': current.geometry.location.lat,
                  'longitude': current.geometry.location.lng,
                  'type': 'gas',
                  'status': (err || query === null) ? null : query.status,
                  'functional': true
                });
                callback();
              });
            });
          }

          async.parallel(calls, function(asyncErr) {
            if (asyncErr) {
              reject('Gas query errored');
            }

            db.close();
            resolve(structuredRes);
          });
        });
      }
    });
  });
}

exports.googleAPI = googleAPICall;

// googleAPICall(40.71442, -74.00608).then(function(jsonObj) {
//   console.log(jsonObj);
// });
