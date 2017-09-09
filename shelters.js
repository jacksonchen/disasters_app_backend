const MongoClient = require('mongodb').MongoClient,
    geolib = require('geolib'),
    DISTANCE_LIMIT = 40000; // 25 miles

redcross = function(lat, long) {
  return new Promise((resolve, reject) => {
    var url = 'mongodb://localhost:27017/test',
        closest = {},
        calls = [];

    MongoClient.connect(url, function(err, db) {
      if (err) {
        reject('Shelter mongo connection errored.');
      }

      db.collection('sheltersTest').find({}).toArray(function(err, shelters) {
        for (var i = 0; i < shelters.length; i++) {
          if (shelters[i].attributes.SHELTER_NAME === "Miami Carol City High School") {
            console.log(geolib.getDistance({ latitude: shelters[i].geometry.x, longitude: shelters[i].geometry.y },
                               { latitude: lat, longitude: long }));
          }
          if (geolib.getDistance({ latitude: shelters[i].geometry.x, longitude: shelters[i].geometry.y },
                             { latitude: lat, longitude: long }) <= DISTANCE_LIMIT) {
            console.log("Test");
            closest.push({
              'name': shelters[i].attributes.SHELTER_NAME,
              'latitude': shelters[i].geometry.x,
              'longitude': shelters[i].geometry.y,
              'type': 'shelter',
              'status': shelters[i].attributes.hasOwnProperty('status') ? null : shelters[i].attributes.status,
              'functional': true
            });
          }
        }
        resolve(closest);
      });
    });
  });
}

exports.shelters = redcross;
