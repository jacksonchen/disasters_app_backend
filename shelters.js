const MongoClient = require('mongodb').MongoClient,
    geolib = require('geolib'),
    DISTANCE_LIMIT = 40000; // 25 miles

redcross = function(lat, long) {
  return new Promise((resolve, reject) => {
    var url = 'mongodb://localhost:27017/test',
        closest = [];

    MongoClient.connect(url, function(err, db) {
      if (err) {
        reject('Shelter mongo connection errored.');
      }

      db.collection('sheltersTest').find({}).toArray(function(err, shelters) {
        for (var i = 0; i < shelters.length; i++) {
          if (geolib.getDistance({ latitude: shelters[i].geometry.y, longitude: shelters[i].geometry.x },
                             { latitude: lat, longitude: long }) <= DISTANCE_LIMIT) {
            closest.push({
              'name': shelters[i].attributes.SHELTER_NAME,
              'latitude': shelters[i].geometry.y,
              'longitude': shelters[i].geometry.x,
              'type': 'shelter',
              'status': shelters[i].attributes.status == null ? 'functional' : shelters[i].attributes.status
            });
          }
        }
        console.log(closest);
        resolve(closest);
      });
    });
  });
}

exports.shelters = redcross;
