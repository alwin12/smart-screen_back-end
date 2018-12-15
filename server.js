
var app = require('express')();
var server = require ('http').Server(app);
var io = require('socket.io')(server);
const socketioAuth = require("socketio-auth");
//const moment = require('moment');
const schedule = require('node-schedule');
var CronJob = require('cron').CronJob;


const {authenticate} = require('./socket-server/socketAuth')
const {timeTableEmitter} = require('./socket-server/eventEmitter')
const {dayFinder,getDay} = require('./utils/dateTime')


socketioAuth(io, { authenticate, postAuthenticate});


let dayAndLoc = {
  day:dayFinder(getDay())
}

function postAuthenticate(client){

 //   var j = schedule.scheduleJob({hour: 00, minute: 10, dayOfWeek: getDay()},()=>{
 //
 //
 //     timeTableEmitter(client,dayAndLoc);
 //
 // });

 var job = new CronJob('43 12 * * 1-6', ()=> {

  timeTableEmitter(client,dayAndLoc);

},  ()=> {  /* This function is executed when the job stops */  },
  true  //, /* Start the job right now */
);

timeTableEmitter(client,dayAndLoc);
}



let PORT = process.env.port || 3002

server.listen(PORT, ()=> {
console.log( `listening to ${PORT}`) ;

})
