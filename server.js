
const app = require('express')();
const server = require ('http').Server(app);
const io = require('socket.io')(server);
const socketioJwt = require('socketio-jwt');
const jwt = require('jsonwebtoken')
const socketioAuth = require("socketio-auth");
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const cloudinary = require('cloudinary')
const multer = require('multer');
const path = require('path');
const CronJob = require('cron').CronJob;
const cors = require('cors');
const _ = require('lodash');
require('dotenv').config();
const excelToJson = require('convert-excel-to-json');
const fs = require('fs')

const {authenticate} = require('./socket-server/socketAuth')
const {authMiddleware} = require('./middleware/authMiddleware')
const {TimeTable} = require('./db/models/Timetable')

const {Lecturehall} = require('./db/models/lectureHall.js')
const {timeTableEmitter,advertsEmitter,timeTableListener} = require('./socket-server/eventEmitter')
const {Staff} = require('./db/models/Staff')
const {dayFinder,getDay} = require('./utils/dateTime')
const {generateAuthToken,verifyToken} = require('./utils/authToken')
const {LecturesByCampus} = require('./utils/filterTimetable')
const {addTimetable} = require('./utils/addTimetable')

const emit = false;




let Socket = {}
app.use(bodyParser.json());
app.use (cors())
//socketioAuth(io, { authenticate, postAuthenticate,timeout:2000});

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function(req,file,cb){

  cb(null,"image-" + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage,

}).single('image')


const fileStorage = multer.diskStorage({
  destination:'./timetableFile',
  filename: function(req,file,cb){
    cb(null,"timetable.xlsx")
  }
})
 const fileUpload = multer({
   storage:fileStorage
 }).single('timetableSheet')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET

})



app.post('/staff/register',(req,res)=>{

  let body = _.pick(req.body,['email','password']);


 let staff = new Staff(body);

   staff.save().then(()=>{


    return staff.generateAuthToken();


  }).then((token)=>{

    data = {
         staff:staff,
         token: token

    }
    res.status(200).send(data);

      //res.header('x-auth',token).send(staff);

  }).catch(e=>{
     res.status(404).send(e)
   })



})



app.get('/staff/home',authMiddleware,(req,res)=>{

 data =  {
   staff: req.staff,
   token: req.token
 }
  //res.status(200).send(req.staff);


})


app.post('/student/lecturehall',(req,res)=>{

  let body = _.pick(req.body,['building','lectureHall'])


  Lecturehall.findByCredentials(body.building,body.lectureHall).then((lecturehall)=>{



    res.status(200).send(lecturehall)




  }).catch(e=>{
    console.log('error ',e)
    res.status(400).send(e);
  })

})
app.post('/login',(req,res)=>{

  console.log('login called');

 let body = _.pick(req.body,['email','password'])

 console.log(body);

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
app.post('/config',(req,res)=>{

    let body = _.pick(req.body,['room','pin'])

    console.log(body);



  if(body.pin === process.env.PIN){

    let token =  generateAuthToken(body.pin,process.env.CONFIG_SALT)



    res.status(200).send({token:token})

  }


  else {

    res.status(400).send();
  }


    // Staff.ConfigPinAuth(body.room,body.pin).then((staff)=>{
    //
    //   console.log(staff)
    //
    //   res.status(200).send({hi:'hi'})
    //
    // }).catch(e=>{
    //
    // })



})



app.delete('/staff/signout',authMiddleware,(req,res)=>{

   req.staff.removeToken(req.token).then(()=>{
     res.status(200).send();
   }).catch(e=>{
     res.status(400).send();
   })

})



app.post('/staff/images',authMiddleware,(req,res)=>{

cloudinary.v2.api.resources().then(images => res.status(200).send(images))


})

app.post('/staff/timetable/upload',fileUpload,(req,res)=>{



    console.log('tt',req.file)

      const result = excelToJson({
        source:fs.readFileSync(`./timetableFile/${req.file.filename}`),
        sheets:[{name:'2019Activities&Locations 4-4-19',
        columnToKey:{


A:"Locations",
B:"NameOfLocations",
C: "Name",
D: "Description",
E: "Size",
F: "Duration",
G: "ActivityDates",
H: "StartDay",
I: "StartTime",
J: "FinishTime",
K: "NameOfStaff",

},

      }]
     })

    //   console.log(result["2019Activities&Locations 4-4-19"])

    let filteredTimetableData = LecturesByCampus(result["2019Activities&Locations 4-4-19"],'MTH All')
    //let allLectures = getAllLectures(filteredTimetableData)

       //console.log(filteredTimetableData.length)

        //populateDatabases(filteredTimetableData)

        addTimetable(filteredTimetableData)



          res.status(200).send({result})



})

app.post('/staff/upload',[authMiddleware,upload],(req,res)=>{

    console.log('req',req.file);

 cloudinary.uploader.upload(req.file.path).then((data)=>{


    advertsEmitter(io,cloudinary);

   res.status(200).send({"adverts":'success'});

 }).catch(e=>{

res.status(400).send(e);

 })

})


let dayAndLoc = {
  day:dayFinder(getDay())
}


io.use((socket,next)=>{



  if(socket.handshake.query && socket.handshake.query.token){


  jwt.verify(socket.handshake.query.token,process.env.CONFIG_SALT,(err,decoded)=>{


   console.log('err',err)

 if(err) return next(new Error('authentication error'))


  socket.decoded = decoded
  next()


  })

}else {
  next(new Error('Authentication error'));
}

}).on('connection',(socket)=>{

 //Object.assign(Socket,socket)
  console.log('client connected')



    timeTableEmitter(socket,dayAndLoc);

    advertsEmitter(io,cloudinary);









var job = new CronJob('43 12 * * 1-6', ()=> {

 timeTableEmitter(socket,dayAndLoc);


},  ()=> {  /* This function is executed when the job stops */  },
 true  //, /* Start the job right now */
);



})


// function postAuthenticate(client){
//
//   client.emit('authenticated',{status:true});
//
//
//
// timeTableEmitter(client,dayAndLoc);
// advertsEmitter(client,cloudinary);
//
//
// }



let PORT = process.env.port || 3001

server.listen(PORT, ()=> {
console.log( `listening to ${PORT}`) ;

})
