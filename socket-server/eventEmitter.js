
//const {data}= require('../sampleData.js')
const {TimeTable} = require('../db/models/Timetable')

const {LectureHall} = require('../db/models/LectureHall.js')



const timeTableEmitter = (client,dayAndLoc,room)=>{

 console.log(dayAndLoc.day,room)
 TimeTable.find({day:dayAndLoc.day,room:room}).then((data)=>{

      
       client.emit("timetable",data);

 })



}


const advertsEmitter = (io,cloudinary)=>{


cloudinary.v2.api.resources().then((adverts)=>{

 console.log('adverts emiited')

  io.emit('adverts',{

    adverts
  })

})
 //
}

const timeTableListener = (client,dayAndLoc) =>{

    client.on('addTimetable',(data)=>{
       let timetable = data.timetable

      let lecture = new Lecture({
        building:timetable.building,
        lectureHall:timetable.lectureHall,
        lecture:timetable.lecture,
        lecturerName:timetable.lecturerName,
        startTime:timetable.startTime,
        endTime:timetable.endTime

      })

      lecture.save().then((lecture)=>{

    return TimeTable.findOneAndUpdate({
      day:timetable.day
    },{$push:{lectures:lecture._id}})

    })

    .then(()=>{

console.log('emmiting after adding')
      timeTableEmitter(client,dayAndLoc)



    }).catch(e=>{

      console.log('error in addTimetable',e)
    })




    })

}

 function getRooms(client){

console.log('room called')
 TimeTable.find().then((data)=>{



    client.emit('rooms',{data:data})

 })



}

module.exports = {timeTableEmitter,advertsEmitter,timeTableListener,getRooms}
