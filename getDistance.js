var geolib = require('geolib');

function simpleDistance(pair1, pair2){
  return geolib.getDistance(pair1, pair2);
}

arrayDistance = function(arrayPairs, theirLocation){
  var distTable = new Object();
  var namesTable = new Object();
  for(var i = 0; i < arrayPairs.length; i++){
    distTable[i] = simpleDistance(arrayPairs[i], theirLocation);
    namesTable[i] = arrayPairs[i];
  }

  var sortedDict = [];
  var items = Object.keys(distTable).map(function(key) {
      return [key, distTable[key]];
  });
  items.sort(function(first, second) {
      return -1*(second[1] - first[1]);
  });
  for(var a = 0; a < items.length; a++){
    sortedDict[a] = namesTable[items[a][0]]
  }

  return sortedDict;
}

exports.arDistance = arrayDistance;

//console.log(arrayDistance([{latitude: 51.5103, longitude: 7.49347}, {"latitude": 39.9, "longitude": -75.2}], {latitude: 39.952219, longitude: -75.193214}));
