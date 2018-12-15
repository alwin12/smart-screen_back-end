
const {mongoose} = require('../mongoose')
const {Lecture} = require('./lecture.js')

 const TimetableSchema = new mongoose.Schema({

      day: {

       type:String,
       required:true,

     },
     lectures: [{type:mongoose.Schema.Types.ObjectId,ref:'Lecture'}]


     }



 )



 TimetableSchema.statics.findLectures = function(day){

   let Timetable = this;


 return TimeTable.find({

   day:'monday'  //day
 })

 }


const TimeTable = mongoose.model('TimeTable',TimetableSchema);


 module.exports = {TimeTable:TimeTable}


// sample data

// let lecture1 = new Lecture(
//   {
//     building: 01,
//     lectureHall:02,
//     lecture:'intepretation',
//     lecturerName:'Scott Valpied',
//     startTime: '10:00',
//     endTime: '12:00'
//   })
//
//
//   let lecture2 = new Lecture(
//     {
//       building: 01,
//       lectureHall:02,
//       lecture:'systems modelling',
//       lecturerName:'Scott Valpied',
//       startTime: 'sd',
//       endTime: 'dd'
//     }
//
// )
//
//
//
//  let timetable1 = new TimeTable({
//
//    day:'monday',
//    lectures:[lecture1._id,lecture2._id]
//
//  })
// lecture2.save().then(()=>{timetable1.save()})
