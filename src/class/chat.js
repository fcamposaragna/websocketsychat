import mongoose from 'mongoose';
import log4js from '../log.js'
const logger = log4js.getLogger();

mongoose.connect("mongodb+srv://admin:123@ecommerce.5mljd.mongodb.net/chatbdd?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology:true})

export default class ContenedorChat {
    constructor(collection, schema, timestamps){
        this.collection = mongoose.model(collection, new mongoose.Schema(schema, timestamps))
    }
    
    getChat = async ()=>{
        try{
            let data = await this.collection.find().populate('users')
            return {status:"success", payload:data}
        }
        catch(error){
            logger.error(error)
            return {status:"error", message:"Hubo un error en el chat" + error}
        }
    }
}