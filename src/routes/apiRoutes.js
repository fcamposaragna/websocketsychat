import express from 'express';
import fork from 'child_process'
const router = express.Router()


router.use(express.json())

router.get('/randoms',(req, res)=>{
    const cant = req.query.cant || 100000000
    console.log(cant)
    res.send({message:'ok'})
})

export default router