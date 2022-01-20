import  Schema  from "mongoose";
import ContenedorChat from "../class/chat.js";

export default class MessageService extends ContenedorChat{
    constructor(){
        super(
            'messages',
            {
                author:{    
                        type: Schema.Types.ObjectId,
                        ref: 'users'
                },
                text: {type:String}
            }, {timestamps: true}
        )
    }
    async sendMessage(message){
        try{
            await this.collection.create(message)
            let messages = await this.collection.find().populate('author')
            return{status:"success", payload:messages}
        }   
        catch(error){
            return {status:"error", message:"No se pudo enviar el mensaje" + error}
        }
    }
    async getMessages(){
        try{
            let data = await this.collection.find().populate('author')
            return {status:"success", payload:data}
        }
        catch(error){
            return {status:"error", message:"Hubo un error al recuperar los mensajes" + error}
        }
    }
    async getDataToNormalize(){
        let documents  = await this.collection.find().populate('author')
        let formatedDocuments = documents.map(document=>{
            document._id = document._id.toString();
            document.author._id = document.author._id.toString();
            delete document.__v;
            return document;
        });
        let object = {
            id:"Messages",
            messages:formatedDocuments
        }
        return object;
    }
}