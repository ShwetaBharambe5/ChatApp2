const jwt = require('jsonwebtoken');

const generateAccesswebtoken=(id,name)=>{
    return jwt.sign({userId:id,name},process.env.JSON_WEB_SECRETKEY)
}



module.exports={generateAccesswebtoken}