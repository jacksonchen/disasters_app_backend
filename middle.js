const gas = require('./googleapi.js'),
      shop = require('./foursquare.js');

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
    callback({'status': '403', 'body': 'An internal server error occurred'});
  })
}

exports.getAll = getAll;
