const express= require('express');
const routes=express.Router();

const userAuthenticate=require('../middleware/authentication');
const Groupcontroller=require('../controller/group');

routes.post('/groups',userAuthenticate.authenticate,Groupcontroller.createNewGroup);
routes.get('/groups',userAuthenticate.authenticate,Groupcontroller.getAllGroups);
routes.post('/groups/addmembers',userAuthenticate.authenticate,Groupcontroller.addMemberGroup);
routes.post('/groups/removemembers',userAuthenticate.authenticate,Groupcontroller.removeMemberinGroup);
routes.patch('/groups/changeAdmin',userAuthenticate.authenticate,Groupcontroller.changeAdminGroup);
routes.delete('/groups/deletegroup/:id',userAuthenticate.authenticate,Groupcontroller.deletGroup)


module.exports=routes;

