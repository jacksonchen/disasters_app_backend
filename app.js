#!/usr/bin/env nodejs
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      middle = require('./middle.js');

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

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});
