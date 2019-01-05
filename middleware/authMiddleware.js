const {Staff} = require('../db/models/Staff')


let authMiddleware =  (req,res,next) =>{

  //let token = req.header('x-auth');
let token = req.body.token

  Staff.findByToken(token).then((staff)=>{
    if (!staff){

    return Promise.reject('staff not found')
    }

    req.staff = staff;
    req.token = token
   next();

  }).catch(e=>{
    res.status(401).send(e)
  }
  )
}


module.exports  = {
  authMiddleware
}
