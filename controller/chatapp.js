
const Message=require('../models/chat');
const Group=require('../models/group')
const {Op}=require('sequelize');
const AWS = require('aws-sdk');
const UUID=require('uuid');
const multer = require('multer');


const id=UUID.v4();

const postMesage=async (req,res,next)=>{
    const {message,groupId}=req.body;
    console.log(message,groupId);
    try {
       await Message.create({
        message,name:req.user.name,userId:req.user.id,groupId,type:'text'
    });
     const newMessage={message,name:req.user.name,userId:req.user.id}
    res.status(200).json({newMessage,msg:'successfull sent',success:true})
        
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({error})
    }
}

const getMessages=async(req,res,next)=>{
        const groupId=req.params.groupId;
        console.log('>>>>groupid',groupId);
   try {
         const data=await Message.findAll({where:{groupId}});
         const group=await Group.findOne({where : {id:groupId}})
         console.log(data);
         res.status(202).json({allGroupMessages:data,success:true})
   } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({msg:'Something wrong Unable to get the Chat',error})
   }

}





///s3upload

const uploadFile=async(req,res,next)=>{
    const {groupId}=req.params;
    const userId=req.user.id;
    const userName=req.user.name;
   
    console.log('comesuploadfile');
    try {
       
 
        const filename="File"+userId+"/"+Date.now()+Math.random();
        console.log(filename);
        const fileUrl=await uploadToS3(req.file,filename);
        await Message.create({groupId,userId,message:fileUrl,name:userName,type:'file'});
        const userFile={
            message:fileUrl,
            name:userName,
            userId
        }
        res.status(201).json({userFile,success:true})  
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(500).json({msg:'Error uploading file',error})
    }


}


async function uploadToS3(data, filename) {
  console.log('------->>>>>>uploadTos3');

      const BUCKET_NAME = process.env.S3BUCKET_NAME;
      const IAM_USER_KEY = process.env.S3BUCKET_ACCESS_KEY;
      const IAM_USER_SECRET = process.env.S3BUCKET_SECRET_KEY;
  
    const s3= new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET

    });

    console.log('------->>>>>>after newAWS.S3');
const file=data;
console.log(data,'------------------------------------->');
const key=`uploads/${id}-${file.originalname}`
      const params = {
        Bucket:BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
      };
      console.log('------->>>>>>After Paramas');
      return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            console.log('Error Uploading File', err);
            reject(err);
          } else {
            console.log('File Uploaded Successfully:', data.Location);
            resolve(data.Location);
          }
        });
      });
  }
  


module.exports={postMesage,getMessages,uploadToS3,uploadFile}