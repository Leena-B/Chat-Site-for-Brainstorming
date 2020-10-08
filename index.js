/* FILENAME: index.js
 * -----------------------
 * This file contains server-side code using Socket.io library to implement real-time
 * communication bwtween users.
*/
var express = require("express");
var socket = require("socket.io");

var app = express();
var port = 3000; // can be any port number

var server = app.listen(port, function() {
  console.log("Listening at http://localhost: " + port);
});

app.use(express.static("public"));
var sock = socket(server);

sock.on("connection", function(socket) {
  console.log("made connection with socket " + socket.id);

  // When function receives "chat" event, emits the chat event back to client
  // side to be displayed to users.
  socket.on("chat", function(data) {
    sock.sockets.emit("chat", data);
  });


  // When function receives "typing" event, emits the event back to client side
  // to be displayed to users. 
  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data); // sends to everyone but the user who initiated the event
  });
});