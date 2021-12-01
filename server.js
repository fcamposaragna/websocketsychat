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

const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en ${PORT}`)
});
export const io = new Server(server)


app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use('/api/productos', productosRouter)
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(upload.single('files'))

app.get('/productos', (req, res)=>{
    contenedor.getAll().then(result=>{
        let info = result
        // let preparedObject = {
        //     productos : info
        // }        
        res.render('products', info)
    })
})



io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} está conectado`)
    let products = await contenedor.getAll()
    let chat = await contenedor.getchat()
    socket.emit('chat', chat)
    socket.emit('vistaProductos', products)
    socket.on('mensajeEnviado', data=>{
        contenedor.chatEnviar(data).then(result=>{
            io.emit('messagelog', result.message)
        })
    })
   
})