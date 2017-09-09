var request = require('request'),
  config = require('config'),
  client_id = config.get('Google.KEY');


googleAPICall = function(lat, long, callback){
  var googleUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=25000&type=gas_station&key=" + client_id;
  request(googleUrl, json = true, function (error, response, body) {
    callback(JSON.parse(body));
  });
}


var googleAPI = module.exports.googleAPICall;

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
