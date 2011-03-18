var socket = new WebSocket('ws://0.0.0.0:8080');

socket.onopen = function(event) {
    $('#messages').append("<li>" + event.data + "</li>");
};

socket.onmessage = function(event) {
    $('#messages').append("<li>" + event.data + "</li>");
};

socket.onclose = function(event) {
    $('#messages').append("<li>" + event.data + "</li>");
};

function sendClick()
{
    textValue = $('#text').val();
    socket.send(textValue);
}
