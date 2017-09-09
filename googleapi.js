var request = require('request'),
  config = require('config'),
  client_id = config.get('Google.KEY');


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
            structuredRes = [];
        for(var i = 0; i < jsonObj.results.length; i++){
          structuredRes.push({
            'name': jsonObj.results[i].name,
            'latitude': jsonObj.results[i].geometry.location.lat,
            'longitude': jsonObj.results[i].geometry.location.lng,
            'type': 'gas',
            'functional': true
          });
        }
        resolve(structuredRes);
      }
    });
  });
}


exports.googleAPI = googleAPICall;

// googleAPICall(40.71442, -74.00608).then(function(jsonObj) {
//   console.log(jsonObj);
// });
