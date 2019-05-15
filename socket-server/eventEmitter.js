
//const {data}= require('../sampleData.js')
const {TimeTable} = require('../db/models/TimeTable')

const {LectureHall} = require('../db/models/LectureHall.js')



const timeTableEmitter = (client,dayAndLoc)=>{



   let lectures = {};
//  data.forEach((data)=>{if (data.day = dayAndLoc.day){Lectures = data.lecture; }});

  LectureHall.findByName(room).then((room)=>{



  })

TimeTable.findLectures(room).then((roomTimetable)=>{


 Lecture.findByDay(roomTimetable).then((timetable)=>{


  client.emit('timetable',{timetable})

 })



}).catch(e=>{

  console.log(e);

})

}


const advertsEmitter = (io,cloudinary)=>{


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
