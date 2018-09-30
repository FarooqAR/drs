#!/usr/bin/env node

var app = require('./app');
var port = 3000;
app.listen(port, function(err){
  if (!err) {
    console.log(`Listening on ${port}`)
  }
});