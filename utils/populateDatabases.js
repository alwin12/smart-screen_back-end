

const  {Lecture} = require('../db/models/Lecture')
const {Lecturehall} =require( '../db/models/LectureHall')
const {TimeTable}  = require('../db/models/Timetable')


  const populateDatabases = (data)=>{

       Lecturehall.deleteMany({}).then(()=>{

         console.log('deleteed')

       }).catch(e=>{

       })


  data.forEach((timetableData)=>{

//populateLectureHall
//populateLecture


     let room = timetableData.NameOfLocations.split('_')[1]



      const lectureHall = new Lecturehall({room})

        lectureHall.save().then(()=>{


        }).catch(e=>{
          //console.log(e);
        })

        addLectures(timetableData)




  })



}


 async function addLectures(timetableData){

   const day = timetableData.StartDay.trim().toLowerCase()
   const room = timetableData.NameOfLocations.split('_')[1].trim()
   const code = timetableData.Name.split('_')[0]
   const name = timetableData.Description
   const staffs = timetableData.NameOfStaff
   const startTime = timetableData.StartTime
   const endTime = timetableData.FinishTime
   const activityDate = timetableData.ActivityDates






         let lecture = await Lecture.findOne({code})
         if(lecture){

           lecture.activityDates.push(activityDate)
            lecture =  await lecture.save()


         }else {

           const lectureData = new Lecture({
             day,
             room,
             code,
             name,
             staffs,
             startTime,
             endTime

           })

              let lecture = await lectureData.save()

              lecture.activityDates.push(activityDate)
            lecture =  await lecture.save()


    let timetable = await TimeTable.findOne({room})

    console.log(timetable)

    if(timetable){

      console.log('timetable',timetable)

    timetable.lectures.push(lecture._id);

    timetable = await timetable.save();


    }

    else if(!timetable){



        let timetable = new TimeTable({room})

        timetable = await timetable.save()

       timetable.lectures.push(
         lecture._id
       )
      timetable = await timetable.save()


      }




}


 }


module.exports ={
  populateDatabases
}
