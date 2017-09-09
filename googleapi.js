var request = require('request'),
  config = require('config'),
  client_id = config.get('Google.KEY');


googleAPICall = function(lat, long, callback){
  return new Promise((resolve, reject) => {
    var googleUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';
    googleUrl = googleUrl.concat(lat, ',', long);
    googleUrl = googleUrl.concat('&radius=25000&type=gas_station&key=', client_id);
    request(googleUrl, json = true, function (error, response, body) {
      if (error) {
        reject('Google API error');
      }
      resolve(JSON.parse(body));
    });
  });
}


exports.googleAPI = googleAPICall;

// googleAPICall(40.71442, -74.00608, function(jsonObj) {
//   var names = [],
//       locations = [];
//   for(var i = 0; i < jsonObj.results.length; i++){
//     names.push(jsonObj.results[i].name)
//     locations.push(jsonObj.results[i].geometry.location)
//   }
//
//   console.log(names)
//   console.log(locations)
// });
