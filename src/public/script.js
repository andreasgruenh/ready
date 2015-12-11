function getDomain() {
  return window.location.href.match(/https?...(.*)/)[1].replace(/:.{5}/, '');
}

var url = "ws://" + getDomain() + ":8000";
var ws = new WebSocket(url);
ws.onopen = function() {
  console.log('Connected to websocket');
};
var participants = 0;
var exercises = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

ws.onmessage = function(e) {
  console.log(e.data);
  if(e.data.match(/client_count/) !== null) {
    participants = e.data.match(/client_count: (.*)/)[1];
  } else {
    exercises = e.data.split('%');
  }
  updateParticipants();
};

function updateParticipants() {
  $('button').each(function(i, button) {
    $(button).html(exercises[i] + '/' + participants + ' Done!');
  });
}

$('button').each(function(i, button) {
  $(button).on('click', function() {
    if($(button).hasClass('done')) {
      ws.send(- button.id);
    } else {
      ws.send(button.id);
    }
    $(button).toggleClass('done');
  });
});
