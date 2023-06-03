const app = require("express")();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

let messages = [];

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/client/index.html");
});

app.get("/style.css", function(req, res) {
	res.sendFile(__dirname + "/client/style.css");
});

app.get("/script.js", function(req, res) {
	res.sendFile(__dirname + "/client/script.js");
});

io.on("connection", function(socket) {
	console.log(`Um usuário com o ID: ${socket.id} se conectou`);

	socket.on("send message", function(data) {
		if (messages.length >= 25) {
			messages = [];
		}

		messages.push(data);
	});

	socket.on("request messages", function() {
		socket.emit("receive messages", messages);
	});

	socket.on("disconnect", function() {
		console.log(`Um usuário com o ID: ${socket.id} se desconectou`);
	});
});

server.listen(port, function() {
	console.log(`Servidor rodando na porta ${port}!`);
});