const {mongoose} = require('../mongoose.js')



const lectureSchema = new mongoose.Schema({

    building:{type:String,required:true},
    lectureHall:{type:String,required:true},
    lecture:{type:String,required:true},
    lecturerName:{type:String,required:true},
    startTime:{type: String,required:true},
    endTime:{type:String,required:true}







})

lectureSchema.statics.findByLocation = function(daysTimetable){

let Lecture = this ;
 console.log(daysTimetable[0])

  return Lecture.find({

   '_id': {
     $in: daysTimetable[0].lectures


   },
   'lectureHall': '2'

 })






}




const Lecture = mongoose.model('Lecture',lectureSchema);


module.exports = {
  Lecture
}
