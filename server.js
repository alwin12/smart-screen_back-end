
const app = require('express')();
const server = require ('http').Server(app);
const io = require('socket.io')(server);
const socketioAuth = require("socketio-auth");
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const CronJob = require('cron').CronJob;
const cors = require('cors');
const _ = require('lodash');


const {authenticate} = require('./socket-server/socketAuth')
const {timeTableEmitter} = require('./socket-server/eventEmitter')
const {Staff} = require('./db/models/Staff')
const {dayFinder,getDay} = require('./utils/dateTime')


app.use(bodyParser.json());
app.use (cors())
socketioAuth(io, { authenticate, postAuthenticate});


app.post('/staff',(req,res)=>{

  let body = _.pick(req.body,['email','password']);


 let staff = new Staff(body);

   staff.save().then(()=>{
     

    return staff.generateAuthToken()


  }).then((token)=>{

      res.header('x-auth',token).send(staff);

  }).catch(e=>{
     res.status(404).send(e);
   })



})




let dayAndLoc = {
  day:dayFinder(getDay())
}

function postAuthenticate(client){

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
