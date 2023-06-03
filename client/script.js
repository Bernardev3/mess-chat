const socket = io();
const sendedMessages = document.getElementById("sendedMessages");
const message = document.getElementById("message");
const username = document.getElementById("username");
const sendButton = document.getElementById("sendButton");

sendButton.onclick = function() {
	socket.emit("send message", {author: username.value, message: message.value});
}

document.addEventListener("keyup", function(event) {
	if (event.key == "Enter") {
		socket.emit("send message", {author: username.value, message: message.value});
	}
});

socket.on("receive messages", function(messages) {
	sendedMessages.innerHTML = "";

	messages.forEach(function(data) {
		sendedMessages.innerHTML += `<div class="message">` +
		`<span class="author">${data.author}</span>` +
		`<br>` +
		`<p>${data.message}</p>` +
		`</div>`;
	});
});

setInterval(function() {
	socket.emit("request messages");
}, 100);