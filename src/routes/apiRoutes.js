import express from 'express';
import {fork} from 'child_process';
import __dirname from '../utils.js';
const router = express.Router()


router.use(express.json())

router.get('/randoms',(req, res)=>{
    const cant = req.query.cant || 100_000_000
    const child = fork(__dirname + '/randoms.js',[cant])
    child.on('message',(data=>{
        console.log(data)
        res.send({message:'ok', payload:data})
    }))
})

export default router