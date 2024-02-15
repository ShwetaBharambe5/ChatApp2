const User=require('../models/user');
const Message=require('../models/chat');
const Group = require('../models/group');
const UserGroup = require('../models/user-group');

async function createNewGroup(req,res,next){
    const {groupname}=req.body;
    try {
        const group=await Group.create({groupname,createdBy:req.user.id});
        await UserGroup.create({groupId:group.id,userId:req.user.id});
        res.status(201).json({msg:`Successfully Created group ${groupname}`})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"No Group created",error})
        
    }
}


async function getAllGroups(req,res,next){
    try {
        const user=await User.findOne({where : {id:req.user.id}});
        const groups=await user.getGroups();
        res.status(201).json({groups,success:true})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Cannot Get Groups',error})
        
    }
}



async function addMemberGroup(req,res,next){
    const email=req.body.memberEmail;
    const groupId=req.body.groupid

  try {
      const user=await User.findOne({where: {email}});
      const group = await Group.findOne({where: {id:groupId}})
      if(!user)   return res.status(404).json({msg:"No user Registered with that email",success:false});
      
      //const member=await member.hasGroups(group)
      const member=await UserGroup.findOne({where:{groupId,userId:user.id}})
      if(member) return res.status(404).json({msg:"User Already present in the group",success:false})
       
      await UserGroup.create({groupId,userId:user.id});
      res.status(201).json({msg:"Member Added Successfully",success:true})
  } catch (error) {
      console.log(error);
      res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
    
  }
}







async function removeMemberinGroup(req,res,next){
    const email=req.body.memberEmail;
    const groupId=req.body.groupid

  try {
      const user=await User.findOne({where: {email}});
      const group = await Group.findOne({where: {id:groupId}})
      if(!user)   return res.status(404).json({msg:"No user Registered with that email",success:false});
      
      //const member=await member.hasGroups(group)
      const member=await UserGroup.findOne({where:{groupId,userId:user.id}})
      if(!member) return res.status(404).json({msg:"User Already not a Member in the group",success:false})
       
      await UserGroup.destroy({groupId,userId:user.id});
      res.status(201).json({msg:"Member Removed Successfully",success:true})
  } catch (error) {
      console.log(error);
      res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
    
  }
}





async function changeAdminGroup(req,res,next){
    const email=req.body.memberEmail;
    const groupId=req.body.groupid;
    console.log(email,groupId);

  try {
      const user=await User.findOne({where: {email}});
      console.log('>>>>>>>',user);
      const group = await Group.findOne({where: {id:groupId}})
      if(!user)   return res.status(404).json({msg:"No user Registered with that email",success:false});
      
      //const member=await member.hasGroups(group)
      const member=await UserGroup.findOne({where:{groupId,userId:user.id}})
      if(!member) return res.status(404).json({msg:"User not a Member in the group please add and change admin",success:false})
       
      await Group.update({createdBy:user.id},{where:{id:groupId}});
      res.status(201).json({msg:"changed admin successfully,You are no longer an admin",success:true})
  } catch (error) {
      console.log(error);
      res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
    
  }
}




async function deletGroup(req,res,next){
    const {id}=req.params;
    try {
        await Group.destroy({where:{id}});
    
        await UserGroup.destroy({where:{groupId:id}});
        
        await Message.destroy({where:{groupId:id}});
        res.status(201).json({msg:"Group Deleted Successsfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Some error occured ,Please try again",success:false,error})
      
        
    }

}
module.exports={createNewGroup,getAllGroups,addMemberGroup,removeMemberinGroup,changeAdminGroup,deletGroup}