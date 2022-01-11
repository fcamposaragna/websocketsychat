import express from 'express'
const router = express.Router()
import Contenedor from '../class/clase.js'
const contenedor = new Contenedor()
router.use(express.json())
import upload from '../services/upload.js'
import {io} from '../app.js'

//GET
router.get('/', (req, res)=>{
    contenedor.getAll().then(result=>{
        res.send(result.productos)
    })
})

router.get('/:id', (req, res)=>{
    let id = parseInt(req.params.id)
    contenedor.getById(id).then(result =>{
        res.send(result)
    })
})

//POST
router.post('/', upload.single('imagen'), (req, res)=>{
    let product = req.body
    let file = req.file
    product.thumbnail = 'http://localhost:8080/' + file.filename
    console.log(file)    
    contenedor.saveObject(product).then(result=>{
        res.send(result)
        contenedor.getAll().then(result=>{

            io.emit('vistaProductos', result)
        })
        })
})

//PUT
router.put('/:id', (req, res)=>{
    let id = parseInt(req.params.id)
    let nuevoProducto = req.body
    contenedor.updateProduct(id, nuevoProducto).then(result=>{
        res.send(result)
    })
})


//DELETE
router.delete('/:id', (req, res)=>{
    let id = parseInt(req.params.id)
    console.log(id)
    contenedor.deleteById(id).then(result=>{
        res.send(result.message)
    })
})


export default router