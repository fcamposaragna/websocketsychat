import fs from 'fs'
import __dirname from '../utils.js'
import mongoose from 'mongoose'
const chatURL = __dirname+'/files/mensajes.txt'
const contenedorURL = __dirname + '/files/productos.txt'

class Contenedor {
    async saveObject(objeto){
        
        try{
            let data = await fs.promises.readFile(contenedorURL, 'utf-8')
            let productos = JSON.parse(data)
            
            if (productos.some(x =>x.id === objeto.id)){
                return {status: "error", message: "Ese producto ya existe"}
            }
            else{
                let productoCreado = {
                    nombre: objeto.nombre,
                    precio: objeto.precio,
                    thumbnail: objeto.thumbnail,
                    id: productos[productos.length-1].id +1
                }
                productos.push(productoCreado)

                try{
                    await fs.promises.writeFile(contenedorURL, JSON.stringify(productos, null, 2))
                    
                    return {status: "success", message: `Producto creado con id: ${productoCreado.id}`}
                }
                catch{
                    return {status: "error", message: "No se pudo crear el producto"}
                }

            }


        }
        catch{
            let productoCreado = {
                nombre: objeto.nombre,
                precio: objeto.precio,
                thumbnail: objeto.thumbnail,
                id: 1
            }
            try{
                await fs.promises.writeFile(contenedorURL, JSON.stringify([productoCreado], null, 2))
                
                return {status: "succes", message:`Producto creado con id: ${productoCreado.id}`}
            }
            catch(err){
                return {status: "Error", message:"No se puedo agregar el producto"}
            }
        }

    }

    async getById(id){
        try{
            let data =  await fs.promises.readFile('./files/productos.txt','utf-8')
            let productos = JSON.parse(data);
            let producto = productos.find(prod=>prod.id===id);
            
            if(producto){
                return {status:"success", producto:producto}
            }else{
                return {status:"error", producto:null, message:"Producto no encontrado"}
            }
        }catch(err){
            return {status:"error",message:"Producto no encontrado"}
        }
    }

    async getAll(){
        try{
            let data = await fs.promises.readFile(contenedorURL, 'utf-8')
            let productos = JSON.parse(data)
            return {status: "succes", productos}
        }
        catch{
            return {status:"error", message:"No se pudo recuperar los productos"}
        }
    }

    async deleteById(num){    
        try{
            let data = await fs.promises.readFile(contenedorURL, 'utf-8')
            let productos = JSON.parse(data)
            let producto = productos.some(x =>x.id === num)            
            let find = productos.findIndex(producto => producto.id === num)  
            console.log(productos.splice(find, 1))
            
            if (producto){
                await fs.promises.writeFile('./files/productos.txt', JSON.stringify(productos, null, 2))
                
                return {status:"success", message: "Producto eliminado"}
            }

        }
        catch{
            return {status:"error", message:"No se pudo eliminar el producto"}
        }
    }

    async deleteAll(){
       
        try{
            await fs.promises.writeFile("/files/productos.txt", JSON.stringify([], null, 2))
        }
        catch{
            return {status: "error", message: "No se pudo eliminar"}
        }
    }

    async cantidad(){
        try{    
            let data =  await fs.promises.readFile('./files/productos.txt','utf-8')
            let productos = JSON.parse(data);
            let cantidad = productos.length
            return  cantidad
        }
        catch{
            return {status:"error", message:"Hubo un error"}
        }
    }

    async updateProduct(id, body){
        try{
            let data = await fs.promises.readFile('./files/productos.txt', 'utf-8')
            let productos = JSON.parse(data)
            if(!productos.some(product=>product.id===id)) return {status:"error", message:"No hay ningún producto con el id especificado"}

            let resultado = productos.map(product=>{
                if(product.id===id){
                    body = Object.assign(body)
                    return body
                }
                
            })
            try{
                await fs.promises.writeFile('./files/productos.txt',JSON.stringify(resultado,null,2));
                return {status:"success", message:"Producto actualizado"}

            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch{
            return {status:"error",message:"Fallo al actualizar el producto"}
        }
        
    }
        
    async chatEnviar(mensaje){
        try{
            
            let data = await fs.promises.readFile(chatURL, 'utf-8')
            let mensajes = JSON.parse(data)
            mensajes.push(mensaje)
            try{
                await fs.promises.writeFile(chatURL, JSON.stringify(mensajes, null, 2))
                return {status:"success", message:mensajes}
            }
            catch{
                return {status:"error", message:"Hubo un error en el chat..."}
            }
            
        }
        catch(error){
            return {status:"error", message:"Hubo un error en el chat" + error}
        }
    }
    
    async getchat(){
        try{
        let data = await fs.promises.readFile(chatURL)
        let mensajes = JSON.parse(data)
        return {status:"success", mensajes}
        }
        catch{
            return {status: "eror", message: "Hubo un error en el chat."}
        }
    }
}

export default Contenedor