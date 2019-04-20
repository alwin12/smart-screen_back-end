const {mongoose} = require('../mongoose.js');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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
    },
    pin:{
      type:Number,
      default:process.env.PIN
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
StaffSchema.statics.findByToken = function(token){

  let staff = this;
  let decoded;

 try {
  decoded = jwt.verify(token,'abc123')
}
catch(e){
return Promise.reject('not verified')

}

return staff.findOne({

  '_id':decoded._id,
  'tokens.token':token,
  'tokens.access':'auth'
})

};

StaffSchema.pre('save', function(next){


 let staff = this;
   if(staff.isModified('password')){

     bcrypt.genSalt(10, (err,salt)=>{

  bcrypt.hash(staff.password,salt,(err,hash)=>{


    staff.password = hash;
    next();
  })

     })

   }
   else {
     next();
   }

  })

  StaffSchema.statics.findByCredentials = function(email,password){

    let staff = this;

   return  staff.findOne({
      email
    }).then((staff)=>{
      if(!staff){
        return Promise.reject();
      }

  return new Promise((resolve,reject)=>{

     bcrypt.compare(password,staff.password,(err,res)=>{

       if(res){
         resolve(staff);
           } else {
         reject();
          }
        })
      })
    })

  }

  StaffSchema.statics.ConfigPinAuth = function(email,pin){
    let staff = this;

     return staff.findOne({email:email}).then((staff)=>{
       if(staff){
         resolve(staff)
       }
       else {
         reject()
       }
     })

  }


StaffSchema.methods.removeToken = function(token){

  var user = this;
  return user.update({
    $pull:{  //pull is used to delete
      tokens:{
       token
      }
    }

  })
}


const Staff = mongoose.model("Staff",StaffSchema);


module.exports ={
  Staff
}
