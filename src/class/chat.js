import mongoose from 'mongoose'
import { normalize, schema } from 'normalizr'

mongoose.connect("mongodb+srv://admin:123@ecommerce.5mljd.mongodb.net/ecommerce?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology:true})

export default class ContenedorChat {
    constructor(){
        this.collection = mongoose.model('chat',
            new mongoose.Schema({
            author: {
                id: {type:String}, 
                nombre: {type:String}, 
                apellido: {type:String}, 
                edad: {type:Number}, 
                alias: {type:String},
                avatar: {type:String}
            },
            text: {type:String}
        }))

    }
    
    getChat = async ()=>{
        try{
            let data = await this.collection.find()
            console.log(data)
            const user = new schema.Entity('user')
            const author = new schema.Entity('author',{
                author:user
            })
            const chat = new schema.Entity('chat',{
                author:author
            })
            const normalizedData = normalize(data,chat)
            console.log(JSON.stringify(normalizedData,null,2))
            return {status:"success", payload:data}
        }
        catch(error){
            return {status:"error", message:"Hubo un error en el chat" + error}
        }
    }
    async chatEnviar(mensaje){
        try{
            await this.collection.create(mensaje)
            return{status:"success"}
        }
        catch(error){
            return {status:"error", message:"Hubo un error en el chat" + error}
        }
    }
}