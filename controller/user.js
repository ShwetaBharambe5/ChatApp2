const User=require('../models/user');
const bcrypt=require('bcrypt');


const userService=require('../services/userservice');


//validation
const isstringinvalid=(string)=>
{
   if(string== undefined ||string.length===0) 
   {
      return true;
   }
   else 
   {
      return false;
   }

}


//After Signup
const postSignup=async (req,res,next)=>{

    const {name,email,phonenumber,password}=req.body;
    try {
       
        if(isstringinvalid(name)||isstringinvalid(email)||isstringinvalid(phonenumber)||isstringinvalid(password)){
            return res.status(400).json({message:'Some field is missing or inappropriate',success:false})
        }

        const user=await User.findOne({where:{email}});
        console.log(user);
        if(user){
            return res.status(404).json({success:false,message:"Users Email or User Already Exist"})
        }
        if(user==null){
             let saltRound=10;
            bcrypt.hash(password,saltRound,async (err,hash)=>{
            if(err) console.log(err);
            await User.create({name,email,phonenumber,password:hash});
            res.status(200).json({message:'Successfully created a User',success:false})
         })

    }

    }catch (error) {
            res.status(500).json({error});
            console.log(JSON.stringify(error));
        
    }
}








//After Login
const postLogin=async (req,res,next)=>{
    const {email,password}=req.body;
    console.log(email,password);
    try {
        if(isstringinvalid(email)||isstringinvalid(password)){
            return res.status(400).json({message:'Some field is missing or inappropriate',success:false})
        }
        const user=await User.findOne({where:{email:email}});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({success:false,message:"Something Went wrong"})
                }
                if(result==true){
                    res.status(200).json({message:'successfully user login',success:true,token:userService.generateAccesswebtoken(user.id,user.name)})
                }
                else{
                    res.status(401).json({success:false,message:"Check password incorrect"})
                }
            })

        }
        if(user==null){
               return  res.status(404).json({success:false,message:"Users Not Found please Signup"})
          }

        
    } catch (error) {
     
        res.status(500).json({error});
        console.log(JSON.stringify(error));
        
    }
}


module.exports={postSignup,isstringinvalid,postLogin};