
//const {data}= require('../sampleData.js')
const {TimeTable} = require('../db/models/Timetable')
const {Lecture} = require('../db/models/lecture.js')



const timeTableEmitter = (client,dayAndLoc)=>{



   let lectures = {};
//  data.forEach((data)=>{if (data.day = dayAndLoc.day){Lectures = data.lecture; }});


TimeTable.findLectures(dayAndLoc.day).then((daysTimetable)=>{


 Lecture.findByLocation(daysTimetable).then((timetable)=>{
 console.log(timetable)
  client.emit('timetable',{timetable})

 })



}).catch(e=>{

  console.log(e);

})






}


module.exports = {timeTableEmitter}
