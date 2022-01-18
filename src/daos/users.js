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
                avatar:{type:String},
                password:{type:String, required:true}
            },{timestamps:true}
        )
    }
    async saveUser(data){
        try{
            let file = await this.collection.create(data)
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