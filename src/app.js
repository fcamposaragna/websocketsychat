import express from 'express'
import cors from 'cors'
import {engine} from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname from './utils.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ios from 'socket.io-express-session';
import MessageService from './daos/messages.js';
import { userService } from "./daos/index.js";
import jwt from 'jsonwebtoken';
import apiRoutes from './routes/apiRoutes.js'
import core from 'os';
import config from './config.js';
import compression from 'compression';
import log4js from './log.js';

const app = express();
const PORT = process.env.PORT || 8080;
const Message = new MessageService()

const logger = log4js.getLogger()
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en ${PORT}`)
});
const baseSession = (session({
    store: MongoStore.create({mongoUrl:config.MONGO_CONNECTION,ttl:1000}),
    resave:false,
    saveUninitialized:false,
    secret: process.env.KEY,
}))
export const io = new Server(server)
io.use(ios(baseSession))

function error404(req, res, next){
    if(req.path=='/info' || req.path=='/currentUser'|| req.path == '/register' || req.path=='/login'){
        logger.info(`Petición realizada a ${req.path} metodo ${req.method}`)
    }else{
        logger.warn(`Petición a ruta inexistente realizada a ${req.path} con el metodo ${req.method}`)
    }
    next()
}
app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(baseSession);
app.use('/api', apiRoutes)
app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(compression());
app.use(error404);


//RUTAS
app.get('/currentUser',(req,res)=>{
    if(req.user!==undefined){
        res.send(req.user)
    }else{
        res.send(req.session.user)
    }
})
app.post('/register', async (req, res)=>{
    let user = req.body
    let result = await userService.saveUser(user);
    logger.info(`Petición realizada a ${req.path} metodo ${req.method}`)
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

app.get('/info', (req, res)=>{
    let preparedObject ={
        arguments: process.argv.slice(2),
        system : process.platform,
        version: process.version,
        process: process.pid,
        memory : JSON.stringify(process.memoryUsage()),
        pathEjection: process.argv[1],
        procesadores: core.cpus().length,
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