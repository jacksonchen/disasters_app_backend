#!/usr/bin/env nodejs
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      middle = require('./middle.js'),
      types = ['grocer', 'gas', 'shelter'];

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/', function(req, res) {
  if (req.body.hasOwnProperty('latitude') && req.body.hasOwnProperty('longitude')) {
    middle.getAll(req.body.latitude, req.body.longitude, function(results) {
      res.status(results.status).send(results.body);
    });
  }
  else {
    res.status(500).send('Bad input');
  }
});

app.post('/update', function(req, res) {
  if (req.body.hasOwnProperty('type') && req.body.hasOwnProperty('latitude')
      && req.body.hasOwnProperty('longitude') && req.body.hasOwnProperty('status')
      && types.indexOf(req.body.type) > -1) {
    middle.updateEntry(req.body.type, req.body.latitude, req.body.longitude, req.body.status, function(results) {
      res.status(results.status).send(results.body);
    });
  }
  else {
    res.status(500).send('Bad input');
  }
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});
