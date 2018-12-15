     const {LectureHall} = require('../db/models/LectureHall')




function authenticate(socket,data,callback){

  LectureHall.findByCredentials(data.username,data.password).then((lectureHall)=>{

console.log(lectureHall);

 return callback(null,true);

}).catch(e=>{
     return callback (new Error('user not found'))
})

 }


module.exports = {
  authenticate
}
