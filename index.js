var app = require('express')(),
	express = require('express'),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	path = require('path'),
	userCounter = 0;

app.use(express.static(path.join(__dirname, '/'))); 

app.get('/', function(requ, res){
    //res.send('<h1>Hello World</h1>');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	
	userCounter += 1;

	socket.on('disconnect', function(){
		console.log('user disconnected');


		userCounter -= 1;
		io.emit('offline', {nickname: socket.nickname, userCounter: userCounter});
	});

	socket.on('online', function(msg) {
		socket.nickname = msg.nickname;
		console.log({nickname: socket.nickname, userCounter: userCounter});
		io.emit('online', {nickname: socket.nickname, userCounter: userCounter});
	})

	socket.on('chat', function(msg){
		io.emit('chat', {nickname: socket.nickname, content: msg.content});
		console.log(msg);
	});
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

