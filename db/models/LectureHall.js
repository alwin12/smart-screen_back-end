const {mongoose}  = require('../mongoose')
const bcrypt = require('bcryptjs');

  const LectureHallSchema = new mongoose.Schema({

     roomNumber: {
       type:String,
       required:true
     },
     password: {
      type:String
    },

  })
LectureHallSchema.statics.findByCredentials = function(roomNumber,password){

let LectureHall = this;


return LectureHall.findOne({
  roomNumber
}).then((lectureHall)=>
{

 if(!lectureHall){
   return promise.reject();
 }


 return new Promise((resolve,reject)=>{

    bcrypt.compare(password,lectureHall.password,(err,res)=>{


  if(res){
  
    resolve(lectureHall);
  }else {
    reject(err);
  }


    })



 })

})



}
LectureHallSchema.pre('save',function(next){


 let lectureHall = this;

  if(lectureHall.isModified('password')){


  bcrypt.genSalt(10,(err,salt)=>{


bcrypt.hash(lectureHall.password,salt,(err,hash)=>{


lectureHall.password = hash;
next();

})

  })
  }
})


const LectureHall = new mongoose.model('LectureHall' ,LectureHallSchema);





module.exports = {LectureHall}
