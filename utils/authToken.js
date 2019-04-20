
const jwt = require('jsonwebtoken')


 const generateAuthToken = (pin,salt) => {

console.log(salt)


  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id:pin,access},salt).toString()


  return token;


}

 const verifyToken = (token,salt)=>{

  let decoded

  try {
   decoded = jwt.verify(token,salt)

   return Promise.resolve(decoded)
 }
 catch(e){

     return Promise.reject();
}
}

module.exports = {
  generateAuthToken,verifyToken
}
