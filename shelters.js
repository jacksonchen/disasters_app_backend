var MongoClient = require('mongodb').MongoClient;

redcross = function(lat, long) {
  return new Promise((resolve, reject) => {
    var url = 'mongodb://localhost:27017/test';
    MongoClient.connect(url, function(err, db) {
      if (err) {
        reject('Shelter mongo connection errored.');
      }

      var best = {};

      var shelters = db.sheltersTest.find({});
      for (var i = 0; i < shelters.length; i++) {
        let dist =
      }
      db.sheltersTest.find({ "geometry.x": { $lt: long }, "geometry.y": { $gt: 36}})
      console.log("Connected correctly to server.");
      db.close();
    });
  });
}

exports.shelters = redcross;
