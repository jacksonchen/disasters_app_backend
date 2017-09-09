const gas = require('./googleapi.js'),
      shop = require('./foursquare.js'),
      MongoClient = require('mongodb').MongoClient;

getAll = function(lat, long, callback) {
  var results = [];
  gas.googleAPI(lat, long).then(function(gasResult) {
    results = results.concat(gasResult);
    return shop.foursquare(lat, long);
  })
  .then(function (shopResult) {
    results = results.concat(shopResult);
    callback({'status': '200', 'body': results});
  })
  .catch(function(err) {
    console.err(err);
    callback({'status': '500', 'body': 'An internal server error occurred'});
  })
}

updateEntry = function(type, lat, long, status, callback) {
  var url = 'mongodb://localhost:27017/test';
  MongoClient.connect(url, function(err, db) {
    if (err) {
      callback({'status': '500', 'body': 'Database query error'});
    }

    switch(type) {
      case 'grocer':
        db.collection('grocers').findOne({'lat': lat, 'long': long}, function(err, query) {
          if (err) {
            return callback({'status': '500', 'body': 'Could not get grocer'});
          }

          if (query) {
            db.collection('grocers').updateOne({'lat': lat, 'long': long}, { $set: { 'status': status }}, function(err, doc) {
              db.close();
              if (err) {
                return callback({'status': '500', 'body': 'Could not save grocer'});
              }
              callback({'status': '200', 'body': 'Success'});
            })
          }
          else {
            db.collection('grocers').insertOne({'lat': lat, 'long': long, 'status': status}, function(err, doc) {
              db.close();
              if (err) {
                return callback({'status': '500', 'body': 'Could not save grocer'});
              }
              callback({'status': '200', 'body': 'Success'});
            });
          }
        })
        break;
      case 'gas':
        db.collection('gas').findOne({'lat': lat, 'long': long}, function(err, query) {
          if (err) {
            return callback({'status': '500', 'body': 'Could not get gas'});
          }

          if (query) {
            db.collection('gas').updateOne({'lat': lat, 'long': long}, { $set: { 'status': status }}, function(err, doc) {
              db.close();
              if (err) {
                return callback({'status': '500', 'body': 'Could not save gas'});
              }
              callback({'status': '200', 'body': 'Success'});
            })
          }
          else {
            db.collection('gas').insertOne({'lat': lat, 'long': long, 'status': status}, function(err, doc) {
              db.close();
              if (err) {
                return callback({'status': '500', 'body': 'Could not save gas'});
              }
              callback({'status': '200', 'body': 'Success'});
            });
          }
        })
        break;
      case 'shelter':
        db.collection('sheltersTest').findOne({'lat': lat, 'long': long}, function(err, query) {
          if (err) {
            return callback({'status': '500', 'body': 'Could not get shelters'});
          }

          if (query) {
            db.collection('sheltersTest').updateOne({'lat': lat, 'long': long}, { $set: { 'status': status }}, function(err, doc) {
              db.close();
              if (err) {
                return callback({'status': '500', 'body': 'Could not save shelters'});
              }
              callback({'status': '200', 'body': 'Success'});
            })
          }
          else {
            db.collection('sheltersTest').insertOne({'lat': lat, 'long': long, 'status': status}, function(err, doc) {
              db.close();
              if (err) {
                return callback({'status': '500', 'body': 'Could not save shelters'});
              }
              callback({'status': '200', 'body': 'Success'});
            });
          }
        })
        break;
      default:
        db.close();
        callback({'status': '400', 'body': 'Malformed type'});
    }
  });
}

exports.getAll = getAll;
exports.updateEntry = updateEntry;
