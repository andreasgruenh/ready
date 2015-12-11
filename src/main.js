var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8000 });
var express = require('express');
var app = express();
var path = require('path');
var _ = require('lodash');

app.use( express.static( path.join(__dirname, "public")));

var exerciseCount = 13;
var clients = [];

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

wss.on('connection', function(socket) {
  var client = {
    socket: socket,
    exercises: {}
  };
  clients.push(client);
  updateState();
  socket.on('message', function(message) {
    if(message < 0) {
      client.exercises[-message] = false;
    } else {
      client.exercises[message] = true;
    }
    updateState();
  });
  socket.on('close', function() {
    var index = clients.indexOf(client);
    clients.splice(index, 1);
  });

});

function updateState() {
  clients.forEach(client => {
    client.socket.send(`META: client_count: ${clients.length}`);
    client.socket.send(calculateFinishCounts().join('%'));
  });
};

function calculateFinishCounts() {
  var result = [];
  _.times(exerciseCount, i => {
    var doneCount = _(clients)
      .pluck('exercises')
      .map(e => e[i+1])
      .filter()
      .countBy()
      .value().true;
    result.push(doneCount);
  });
  return result.map(e => e === undefined ? 0 : e);
}
