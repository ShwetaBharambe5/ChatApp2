const express=require('express');

const bodyParser=require('body-parser');
const cors=require('cors');
const http =require ("http");
const socketIO=require('socket.io')

const path = require('path');

const app=express();
const server = http.createServer(app);
const io= socketIO(server,{ cors : { origin : '*'}});


io.on("connection",(socket)=>{
    console.log('websocket connected-------------------------------------------');
    socket.on("message",(msg,userName,groupId,userId)=>{
        socket.broadcast.emit("message",msg,userName,groupId,userId)
    });
    socket.on("file",(message,userName,groupId,userId)=>{
        socket.broadcast.emit("file",message,userName,groupId,userId)

    })
})


require('dotenv').config()

const sequelize=require('./utils/database');
const userRoutes=require('./routes/user');
const chatRoutes=require('./routes/chat');
const groupRoutes=require('./routes/group')
const User=require('./models/user');
const Message=require('./models/chat');
const Group=require('./models/group');
const UserGroup=require('./models/usergroup');


app.use(cors({
    origin:'*'
}));
app.use(bodyParser.json());


app.use(express.static('public'))

app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/views/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  });
  
app.use('/user',userRoutes);
app.use('/chat',chatRoutes);
app.use(groupRoutes);


User.hasMany(Message);
Message.belongsTo(User);


Group.belongsToMany(User,{through:UserGroup});
User.belongsToMany(Group,{through:UserGroup})

Group.hasMany(Message);
Message.belongsTo(Group);


sequelize.sync()
.then((res)=>{
    server.listen(process.env.PORT,()=>console.log(`Server starts at ${process.env.PORT}`))
})
.catch(err=>console.log(err));












