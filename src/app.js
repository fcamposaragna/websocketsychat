import express from 'express'
import cors from 'cors'
import {engine} from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname from './utils.js';
import { productsFaker } from './faker.js';
import UserService from './daos/users.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ios from 'socket.io-express-session';
import MessageService from './daos/Messages.js';
const app = express();
const PORT = process.env.PORT || 8080;
const User = new UserService()
const Message = new MessageService()


const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en ${PORT}`)
});
const baseSession = (session({
    store: MongoStore.create({mongoUrl:'mongodb+srv://admin:123@ecommerce.5mljd.mongodb.net/sessions?retryWrites=true&w=majority',ttl:60}),
    resave:false,
    saveUninitialized:false,
    secret:'ch4t',
    cookie:{maxAge:60000}
}))
export const io = new Server(server)
io.use(ios(baseSession))

app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(baseSession);


//RUTAS
app.get('/api/productos-test', (req, res)=>{
    res.render('productsRandom', productsFaker())
})

app.get('/currentUser',(req,res)=>{
    res.send(req.session.user)
})
app.post('/register', async (req, res)=>{
    let user = req.body
    let result = await User.saveUser(user);
    res.send({message:"Usuario creado", user:result})
})
app.post('/login', async (req, res)=>{
    let {email,password} = req.body;
    if(!email||!password){
        return res.status(400).send({error:"Datos incompletos"}
    )};
    const user = await User.getUser(email);
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

//SOCKET
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} está conectado`)
    let conversacion = await Message.getMessages()
    socket.emit('chat', conversacion)
    socket.on('mensajeEnviado', async data=>{
        const user = await User.getUser(socket.handshake.session.user.email)
        let message = {
            author:user.payload._id,
            text:data.message
        }
        await Message.sendMessage(message).then(result=>{
            io.emit('messagelog', result)
        })
    })
   
})