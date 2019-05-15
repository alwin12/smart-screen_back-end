



  const LecturesByCampus = (timetable,campus)=>{


            const filteredTimetable = timetable.filter((data)=>{

           return (data.Locations === campus && data.Name.includes('LEC/01') )


            })

   return filteredTimetable

  }


module.exports = {
     LecturesByCampus
}
