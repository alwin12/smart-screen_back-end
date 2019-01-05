
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
const {authMiddleware} = require('./middleware/authMiddleware')
const {timeTableEmitter} = require('./socket-server/eventEmitter')
const {Staff} = require('./db/models/Staff')
const {dayFinder,getDay} = require('./utils/dateTime')


app.use(bodyParser.json());
app.use (cors())
socketioAuth(io, { authenticate, postAuthenticate});


app.post('/staff/register',(req,res)=>{

  let body = _.pick(req.body,['email','password']);


 let staff = new Staff(body);

   staff.save().then(()=>{


    return staff.generateAuthToken()


  }).then((token)=>{

    data = {
         staff:staff,
         token: token

    }
    res.status(200).send(data);

      //res.header('x-auth',token).send(staff);

  }).catch(e=>{
     res.status(404).send(e);
   })



})



app.get('/staff/home',authMiddleware,(req,res)=>{

 data =  {
   staff: req.staff,
   token: req.token
 }
  //res.status(200).send(req.staff);


})
app.post('/staff/timetable',authMiddleware,(req,res)=>{


   data =  {
     staff: req.staff,
     token: req.token,
     timetable: {name:'lecture101'}
   }

   res.status(200).send(data);




})
app.post('/signin',(req,res)=>{

 let body = _.pick(req.body,['email','password'])

  Staff.findByCredentials(body.email,body.password).then((staff)=>{


   return staff.generateAuthToken().then((token)=>{

     data ={
       staff:staff,
       token:token
     }

     //res.header('x-auth',token).send(staff);
     res.status(200).send(data)


   })

  }).catch(e=>{
    res.status(400).send();
  })

})

app.delete('/staff/signout',authMiddleware,(req,res)=>{

   req.staff.removeToken(req.token).then(()=>{
     res.status(200).send();
   }).catch(e=>{
     res.status(400).send();
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
