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
            let data = await this.collection.create(message)
            return{status:"success", payload:data}
        }   
        catch(error){
            return {status:"error", message:"No se pudo enviar el mensaje" + error}
        }
    }
    async getMessages(){
        try{
            let data = await this.collection.find().populate('author')
            console.log(data)
            return {status:"success", payload:data}
        }
        catch(error){
            return {status:"error", message:"Hubo un error al recuperar los mensajes" + error}
        }
    }
}