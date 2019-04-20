const {mongoose}  = require('../mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

  const LecturehallSchema = new mongoose.Schema({

     building: {
       type:String,
       required:true
     },
     lectureHall: {
      type:String
    },

  })
LecturehallSchema.statics.findByCredentials = function(building,lectureHall){

let LectureHall = this;


return LectureHall.findOne({
  building,
  lectureHall
})



 // return new Promise((resolve,reject)=>{
 //
 //    bcrypt.compare(password,lectureHall.password,(err,res)=>{
 //
 //
 //  if(res){
 //
 //    resolve(lectureHall);
 //  }else {
 //    reject(err);
 //  }
 //
 //
 //    })
 // })



}

// LecturehallSchema.pre('save',function(next){
//
//
//  let lectureHall = this;
//
//   if(lectureHall.isModified('password')){
//
//
//   bcrypt.genSalt(10,(err,salt)=>{
//
//
// bcrypt.hash(lectureHall.password,salt,(err,hash)=>{
//
//
// lectureHall.password = hash;
// next();
//
// })
//
//   })
//   }
// })



let Lecturehall = mongoose.models.lecturehall || mongoose.model('lecturehall', LecturehallSchema);



module.exports = {Lecturehall}
