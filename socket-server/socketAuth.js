     const {LectureHall} = require('../db/models/LectureHall')
     const {Staff} = require('../db/models/Staff')





function authenticate(socket,data,callback){

  console.log('function called')

if(data.client=='student'){

  LectureHall.findByCredentials(data.building,data.lectureHall).then((lectureHall)=>{

console.log('authenticated')
 return callback(null,true);

}).catch(e=>{
  console.log('not auth')
     return callback (new Error('student not found'))
})

}
else if(data.client =='staff'){

  Staff.findByToken(data.token).then(()=>{


return callback(null,true)


}).catch(e=>{
  return callback(new Error('staff not found'))
})


}
else {
  return callback(new Error('staff not found'))
}


}

module.exports = {
  authenticate
}
