import express from 'express'
const app = express();
import cors from 'cors'
const PORT = process.env.PORT || 8080;
import Contenedor from './class/clase.js'
const contenedor = new Contenedor();
import productosRouter from './routes/productos.js'
import {engine} from 'express-handlebars'
import upload from './services/upload.js'
import {Server} from 'socket.io'
import __dirname from './utils.js';
import { productsFaker } from './faker.js';
import ContenedorChat from './class/chat.js'
const chat = new ContenedorChat()

const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en ${PORT}`)
});
export const io = new Server(server)


app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname+'/public'))
app.use('/api/productos', productosRouter)
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(upload.single('files'))

app.get('/productos', (req, res)=>{
    contenedor.getAll().then(result=>{
        let info = result     
        res.render('products', info)
    })
})

app.get('/api/productos-test', (req, res)=>{
    res.render('productsRandom', productsFaker())
})

io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} está conectado`)
    let products = await contenedor.getAll()
    let conversacion = await chat.getChat()
    socket.emit('chat', conversacion)
    socket.emit('vistaProductos', products)
    socket.on('mensajeEnviado', data=>{
        chat.chatEnviar(data).then(result=>{
            console.log(result)
            io.emit('messagelog', result.message)
        })
    })
   
})