/* FILENAME: chat.js
 * ----------------------
 * This file contains the script for the client-side of communication,
 * as well as the code for the balloon animation.
*/

// variable below save user inputs by referring to ids in html code
var socket = io.connect("http://localhost:3000");
var message = document.getElementById("message");
var userName = document.getElementById("userName");
var sendBtn = document.getElementById("send");
var messages = document.getElementById("messages");
var typing = document.getElementById("typing");

// constants for balloon animation
var windowWidth = document.getElementById("right-half").offsetWidth;
var cur_balloon = 0;
var num_balloons = Math.floor(windowWidth / 126) - 2;
var full = true;
var top_pos = 98;
var rows = 6;
var colors = ["red", "blue", "violet", "green"];
var right = document.getElementById("right-half")
var windowWidth = document.getElementById("right-half").clientWidth;
var chatWidth = document.getElementById("left-half").clientWidth;


// This function emits "chat" event when the user hits the "Brainstorm!" button
sendBtn.addEventListener("click", function() {
  socket.emit("chat", {
    message: message.value,
    userName: userName.value
  });
  	message.value = '' 
});


// Displays message on screen when it receives "chat" event
socket.on("chat", function(data) {
  messages.innerHTML +=
    "<p><strong>" + data.userName + ": </strong>" + data.message + "</p>";
  // clear the typing indicator when we receive a message
  typing.innerHTML = "";
  createBalloon(data)
});


// This function emits a “typing” event when a user begins typing
message.addEventListener("keypress", function() {
  socket.emit("typing", userName.value);
});


// Displays typing message on screen when it receives a "typing" event
socket.on("typing", function(data) {
  typing.innerHTML = "<p><em>" + data + " is typing</em></p>";
});


// This function executes the balloon animation as seen on the website, taking
// in a single parameter of the user's chat.
function createBalloon(data) {
	if (full && cur_balloon > num_balloons - 1) {
  		full = false;
  		cur_balloon = 0;
  		top_pos = top_pos - 20;
  }
  else if (!full && cur_balloon > num_balloons - 2) {
  		full = true;
  		cur_balloon = 0;
  		top_pos = top_pos - 20;
  }
 	else {
  	 	cur_balloon = cur_balloon + 1;
  }

	var rand = Math.floor(Math.random()*4); 
	var balloon = document.createElement('div');
  balloon.className = "balloon-"+colors[rand]; //chooses random color

  if (full) {
  	balloon.style.left = chatWidth + (cur_balloon * 126) + 63 + "px"; 
  } else {
  	balloon.style.left = chatWidth + (cur_balloon * 126) + 126 + "px";
  }

  var textbox = document.createElement('div');
  textbox.className = "balloontext";
  textbox.append(data.message);
  balloon.append(textbox);
  right.appendChild(balloon);
  animateBalloon(balloon);
}


// This function executes the balloon animation using setInterval.
function animateBalloon(elem) {
	var interval = setInterval(frame, 20);
	var pos = 0;

	function frame() {
		if (pos == top_pos) {
			clearInterval(interval);
		}
		else {
			pos = pos + 1;
			elem.style.top = 99 - pos + "vh";
		}
	}
}

