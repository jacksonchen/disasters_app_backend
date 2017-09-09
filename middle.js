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
        manipulateDB(db, 'grocers', lat, long, status, function(res) {
          callback(res);
        });
        break;
      case 'gas':
        manipulateDB(db, 'gas', lat, long, status, function(res) {
          callback(res);
        });
        break;
      case 'shelter':
        manipulateDB(db, 'sheltersTest', lat, long, status, function(res) {
          callback(res);
        });
        break;
      default:
        db.close();
        callback({'status': '400', 'body': 'Malformed type'});
    }
  });
}

manipulateDB = function(db, coll, lat, long, status, callback) {
  db.collection(coll).findOne({'lat': lat, 'long': long}, function(err, query) {
    if (err) {
      return callback({'status': '500', 'body': 'Could not get ' + coll});
    }

    if (query) {
      db.collection(coll).updateOne({'lat': lat, 'long': long}, { $set: { 'status': status }}, function(err, doc) {
        db.close();
        if (err) {
          return callback({'status': '500', 'body': 'Could not save ' + coll});
        }
        callback({'status': '200', 'body': 'Success'});
      })
    }
    else {
      db.collection(coll).insertOne({'lat': lat, 'long': long, 'status': status}, function(err, doc) {
        db.close();
        if (err) {
          return callback({'status': '500', 'body': 'Could not save ' + coll});
        }
        callback({'status': '200', 'body': 'Success'});
      });
    }
  })
}

exports.getAll = getAll;
exports.updateEntry = updateEntry;
