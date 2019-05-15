
const {mongoose} = require('../mongoose')
const {TimeTable} = require('./TimeTable.js')

 const TimetableSchema = new mongoose.Schema({

      room: {

       type:String,
       required:true,
       unique:true

     },
     lectures: [{type:mongoose.Schema.Types.ObjectId,ref:'lecture'}]


     }

 )

 TimetableSchema.statics.findLectures = function(room){

   let Timetable = this;


 return TimeTable.find({

   room:room  //day
 })

 }


const TimeTable = mongoose.model('timetable',TimetableSchema);


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
