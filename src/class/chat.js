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
            const users = new schema.Entity('users')
            const author = new schema.Entity('author',{
                author:users
            })
            const chat = new schema.Entity('chat',{
                chat:author
            })
            const normalizedData = normalize(data,chat)
            console.log(normalizedData)
            return {status:"success", payload:data}
        }
        catch(error){
            return {status:"error", message:"Hubo un error en el chat" + error}
        }
    }
    async chatEnviar(mensaje){
        try{
            await this.collection.create(mensaje)
            let data = await this.collection.find()
            return{status:"success", payload:data}
        }
        catch(error){
            return {status:"error", message:"Hubo un error en el chat" + error}
        }
    }
}