const {mongoose} = require('../mongoose.js')



const timetableSchema = new mongoose.Schema({

    day:{type:String,required:true},
    room:{type:String,required:true},
    code:{type:String,required:false},
    name:{type:String,required:false},
    staffs:{type:String},
    startTime:{type: String,required:true},
    endTime:{type:String,required:true},
    activityDate: {type:String,required:true}






})

timetableSchema.statics.findByLocation = function(RoomTimetable,day){

let Timetable = this;


  return Timetable.find({

   '_id': {
     $in: [0].RoomTimetable.lectures


   },
   'day': day

 })
}

   //delete mongoose.connection.models['lecture']


//const Lecture = mongoose.model('Lecture',lectureSchema);

const TimeTable =  mongoose.models.table ||mongoose.model('table', timetableSchema);


module.exports = {
  TimeTable
}
