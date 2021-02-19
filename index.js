var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('user connected: ', socket.id);
  var num = Math.floor((Math.random() * (99999 - 10000))) + 10000;
  var name = "익명_" + num;
  var msg = name + "님이 입장하셨습니다.";
  io.to(socket.id).emit('change name', name);
  io.emit('receive message', msg);

  socket.on('disconnect', function(){
    console.log('user disconnected: ', socket.id);
    msg = name + "님이 퇴장하셨습니다.";
    io.emit('receive message', msg);
  });

  socket.on('send message', function(name, text){
    msg = name + ' : ' + text;
    console.log(socket.id + " : " + text);
    io.emit('receive message', msg);
  });
});

http.listen(80, function(){
  console.log('server on');
});