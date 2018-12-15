const mongoose = require ('mongoose')

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/Timetable',{useNewUrlParser:true})


module.exports = {
  mongoose
}
