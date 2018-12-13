
var app = require('express')();
var server = require ('http').Server(app);
var io = require('socket.io')(server);


const socketioAuth = require("socketio-auth");

socketioAuth(io, { authenticate, postAuthenticate});

 function authenticate(socket,data,callback){

    let username = data.username;
    let password = data.password;

    if(username != client.username|| password!=client.password){


      return callback (new Error('user not found'))
    }

   return callback(null,true);

 }

function postAuthenticate(client){

 //emit messages


}

//  io.on('connection',(client)=>{
//
// client.on("hello",(data)=>{
//
// console.log(data)
//
// })
//  })


let client  ={
  usernamme:'302',
  password:'302302'
}





let PORT = process.env.port || 3002


server.listen(PORT, ()=> {


console.log( `listening to ${PORT}`) ;



})
