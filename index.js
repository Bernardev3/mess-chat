const app = require("express")();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

let messages = [];
let users = [];

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/client/index.html");
});

app.get("/style.css", function(req, res) {
	res.sendFile(__dirname + "/client/style.css");
});

app.get("/script.js", function(req, res) {
	res.sendFile(__dirname + "/client/script.js");
});

app.get("*", function(req, res) {
	res.sendFile(__dirname + "/client/404.html");
});

io.on("connection", function(socket) {
	console.log(`Um usuário com o ID: ${socket.id} se conectou`);

	users.push(socket.id);

	if (messages != []) {
		socket.emit("receive messages", messages);
	}

	socket.on("send message", function(data) {
		if (messages.length >= 25) {
			messages = [];
		}

		messages.push(data);

		users.forEach(function(userID) {
			socket.to(userID).emit("receive messages", messages);
		});

		socket.emit("receive messages", messages);
	});

	socket.on("disconnect", function() {
		console.log(`Um usuário com o ID: ${socket.id} se desconectou`);
		users.splice(users.indexOf(socket.id), 1);
	});
});

server.listen(port, function() {
	console.log(`Servidor rodando na porta ${port}!`);
});