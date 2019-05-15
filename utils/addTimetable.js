const {TimeTable}  = require('../db/models/TimeTable')




  const  addTimetable = async (data)=>{


   // delete previous timeTables
   let deletedData = await TimeTable.deleteMany({})

   // add new timetables

    data.forEach((timetableData)=>{



      addEach(timetableData);



    })

    


}


  async function addEach(timetableData){

    const day = timetableData.StartDay.trim().toLowerCase()
    const room = timetableData.NameOfLocations.split('_')[1].trim()
    const code = timetableData.Name.split('_')[0]
    const name = timetableData.Description
    const staffs = timetableData.NameOfStaff
    const startTime = timetableData.StartTime
    const endTime = timetableData.FinishTime
    const activityDate = timetableData.ActivityDates

    const timetableObj = new TimeTable({
      day,
      room,
      code,
      name,
      staffs,
      startTime,
      endTime,
      activityDate

    })

    const timetable = await timetableObj.save();




  }


module.exports = {addTimetable}
