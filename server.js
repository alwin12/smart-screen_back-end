
var app = require('express')();
var server = require ('http').Server(app); 
var io = require('socket.io')(server);


























server.listen(3002, ()=> {


console.log('listening to port 3002') ;



})

