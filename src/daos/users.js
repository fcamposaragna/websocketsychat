import ContenedorChat from "../class/chat.js";

export default class UserService extends ContenedorChat{
    constructor(){
        super(
            'users',{
                nombre:{type:String, required:true},
                apellido:{type:String},
                edad:{type:Number},
                alias:{type:String, required:true},
                email:{type:String, required:true},
                avatar:{type:String, required:true, default:"data:image/png;base64,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"},
                password:{type:String, required:true}
            },{timestamps:true}
        )
    }
    async saveUser(data){
        try{
            await this.collection.create(data)
            return{status:"success", message:"Usuario creado"}
        }
        catch(error){
            return{status:"error", message:"Hubo un error con el registro" + error}
        }
    }
    async getUser(email){
        try{
            let user = await this.collection.findOne({email:email})
            return {status:"success", payload:user}
        }
        catch(error){
            return {status:"error", message:"Hubo un error al obtener el usuario" + error}
        }
    }
}