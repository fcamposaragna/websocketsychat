import express from 'express'
import cors from 'cors'
import {engine} from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname from './utils.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ios from 'socket.io-express-session';
import MessageService from './daos/Messages.js';
import initializePassportConfig from './passport/passport-config.js';
import passport from 'passport';
import { userService } from "./daos/index.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import apiRoutes from './routes/apiRoutes.js'
import minimist from 'minimist';

dotenv.config()
const app = express();

const PORT = process.argv[2] || 8080;
const Message = new MessageService()

const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en ${PORT}`)
});
const baseSession = (session({
    store: MongoStore.create({mongoUrl:'mongodb+srv://admin:123@ecommerce.5mljd.mongodb.net/sessions?retryWrites=true&w=majority',ttl:1000}),
    resave:false,
    saveUninitialized:false,
    secret: process.env.KEY,
}))
export const io = new Server(server)
io.use(ios(baseSession))

app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(baseSession);
app.use('/api', apiRoutes)
initializePassportConfig();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

// const authMiddleware = (req,res, next)=>{
//     const authHeader = req.headers.authorization
//     if(!authHeader||authHeader==="null") return res.status(401).send({status:"error", error:"No autorizado"})
//     let token = authHeader;
//     jwt.verify(token, key, (rtt, decoded)=>{
//         req.user = decoded.user;
//         next()
//     })
// }


//RUTAS
app.get('/currentUser',(req,res)=>{
    console.log(req)
    if(req.user!==undefined){
        res.send(req.user)
    }else{
        res.send(req.session.user)
    }
})
app.post('/register', async (req, res)=>{
    let user = req.body
    let result = await userService.saveUser(user);
    res.send({message:"Usuario creado", user:result})
})
app.post('/login', async (req, res)=>{
    let {email,password} = req.body;
    if(!email||!password){
        return res.status(400).send({error:"Datos incompletos"}
    )};
    const user = await userService.getUser(email);
    if(!user){
       return res.status(404).send({error:"Usuario no encontrado"});
    } 
    if(user.payload.password!==password) {
        return res.status(404).send({error:"Contraseña incorrecta"})
    };
    req.session.user={
        email: user.payload.email,
        alias: user.payload.alias
    }
    res.send({status:"logged"})
})
app.get('/pages/goodbye', (req, res)=>{
    req.session.destroy()
})
app.get('/auth/facebook', passport.authenticate('facebook',{scope:['email']}),(req,res)=>{

})

app.get('/auth/facebook/callback', passport.authenticate('facebook',{
    failureRedirect: '/error'
}),async (req,res)=>{
    //console.log(req.user+ 'En el callback ')
    const user = await userService.getUser(req.user.email)
    req.session.user={
        email: user.payload.email,
        alias: user.payload.alias,
        avatar: user.payload.avatar
    }

    res.redirect('http://localhost:8080/profile')
})
app.get('/profile',(req,res)=>{
    console.log(req.user)
    res.render('profile',req.user)
})
app.get('/info', (req, res)=>{
    let preparedObject ={
        arguments: process.argv.slice(2),
        system : process.platform,
        version: process.version,
        process: process.pid,
        memory : JSON.stringify(process.memoryUsage()),
        pathEjection: process.argv[1],
        carp :process.cwd
    }
    res.render('info', preparedObject)
})
//SOCKET
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} está conectado`)
    let conversacion = await Message.getMessages()
    socket.emit('chat', conversacion)
    socket.on('mensajeEnviado', async data=>{
        const user = await userService.getUser(socket.handshake.session.user.email)
        let message = {
            author:user.payload._id,
            text:data.message
        }
        await Message.sendMessage(message).then(result=>{
            io.emit('messagelog', result)
        })
    })
   
})