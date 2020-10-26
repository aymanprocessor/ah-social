require('dotenv').config();
const express = require('express') ; 
const path = require('path') ; 
const cors = require('cors') ; 
const server = express()
const app = require('http').createServer(server) ; 
const socketIo = require('socket.io')(app);





socketIo.activeUsers = {} ;
require('./serverSockets/init.socket')(socketIo) ;
require('./serverSockets/friends.socket')(socketIo) ;
require('./serverSockets/chat.socket')(socketIo) ;






server.use(cors())
const mongoose = require('mongoose') ; 
mongoose.connect(process.env.DB_URL , { useNewUrlParser: true , useUnifiedTopology: true} ) ;



const homeRouter = require('./routes/home.router');
server.use('/api' ,homeRouter) ;

const authRouter = require('./routes/auth.router') ; 
server.use('/api' , authRouter) ;

const postsRouter = require('./routes/posts.router') ; 
server.use('/api' , postsRouter) ;



const friendsRouter = require('./routes/friends.router') ; 
server.use('/api/friends' , friendsRouter) ;

const chatRouter = require('./routes/chat.router') ; 
server.use('/api' , chatRouter) ;

const updateProfileRouter = require('./routes/updateInfo.router') ; 
server.use('/api' ,updateProfileRouter) ;



server.use(express.static(path.join('public')))


const port = process.env.PORT || 3000 ;
app.listen(port , ()=> console.log('server is running...'))






