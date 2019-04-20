
//const {data}= require('../sampleData.js')
const {TimeTable} = require('../db/models/Timetable')
const {Lecture} = require('../db/models/lecture.js')



const timeTableEmitter = (client,dayAndLoc)=>{



   let lectures = {};
//  data.forEach((data)=>{if (data.day = dayAndLoc.day){Lectures = data.lecture; }});


TimeTable.findLectures(dayAndLoc.day).then((daysTimetable)=>{


 Lecture.findByLocation(daysTimetable).then((timetable)=>{


  client.emit('timetable',{timetable})

 })



}).catch(e=>{

  console.log(e);

})

}


const advertsEmitter = (io,client,cloudinary)=>{


cloudinary.v2.api.resources().then((adverts)=>{

 console.log('adverts emiited')

  io.emit('adverts',{
    adverts
  })

})


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

module.exports = {timeTableEmitter,advertsEmitter,timeTableListener}
