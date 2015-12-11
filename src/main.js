var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8000 });
var express = require('express');
var app = express();
var path = require('path');
var _ = require('lodash');

app.use( express.static( path.join(__dirname, "public")));

var exerciseCount = 13;
var clients = [];

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

wss.on('connection', function(socket) {
  var client = {
    socket: socket,
    exercises: {};
  };
  clients.push(client);

  socket.on('message', function(message) {
    if(message < 0) {
      client.exercises[-message] = false;
    } else {
      client.exercises[message] = true;
    }
    updateState();
  });
  socket.on('close', function() {

  });
  socket.send(`META: client_count: ${wss.clients.length}`);
});

function updateState() {
  var exercises = clients.reduce((agg))
  clients.forEach(function(client) {
    client.socket.send(createExerciseString());W
  });
};

function createExerciseString() {
  return exercises.reduce((str, e) => str+'%'+e, '');
}
