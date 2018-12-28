const {mongoose} = require('../mongoose.js');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require ('lodash')

const StaffSchema = new mongoose.Schema({

    email: {


      type:String,
      required:true,
      unique:true,
      trim:true,
      minlength:1 ,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password: {

      type:String,
      required:true,
      minlength:6,

    },
    tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }

    }]



});

StaffSchema.methods.toJSON = function(){ // to send only the id and email to the front-end..its an overridden method
  let user = this;
  let userObject = user.toObject();
   return _.pick(userObject,['_id','email']);

}

StaffSchema.methods.generateAuthToken = function(password){

  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString()

    user.tokens.push({access,token});

  return user.save().then(()=>{
    return token
  })

}

const Staff = mongoose.model("Staff",StaffSchema);


module.exports ={
  Staff
}
