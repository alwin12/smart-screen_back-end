

const getDay = () =>{

   let today = new Date();

     return today.getDay();
}

 const dayFinder = (dayInNumeric)=>{

   switch(dayInNumeric)
   {
  case 1: return 'monday'
        break;
  case 2: return 'tuesday'
        break;
  case 3: return 'wednesday'
        break;
  case 4: return 'thursday'
        break;
  case 5: return 'friday'
        break;
  case 6: return 'saturday'
        break;
  case 0: return 'sunday'
        break;

  defaut: return 0


   }



 }


module.exports = {dayFinder,getDay}
