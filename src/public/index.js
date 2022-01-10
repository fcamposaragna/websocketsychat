const socket = io()


//Vista de productos
socket.on('vistaProductos', data=>{
    
    let products = data.productos
    fetch('templates/tablaProductos.handlebars').then(string=>string.text()).then(template=>{
        const processedTemplate = Handlebars.compile(template)
        const templateObject={
            products
        }
        const html = processedTemplate(templateObject)
        let div = document.getElementById('tablaProductos')
        div.innerHTML=html
    })
})


//chat

const email = document.getElementById('email')
const nombre = document.getElementById('nombre')
const apellido = document.getElementById('apellido')
const edad = document.getElementById('edad')
const alias = document.getElementById('alias')
const input = document.getElementById('mensaje')
const avatar = document.getElementById('avatar')

function miFunc(){
    let preparedObject = {
        athor:{
            id: email.value,
            nombre: nombre.value,
            apellido: apellido.value,
            edad: edad.value,
            alias: alias.value,
            avatar: avatar.value,
        },
        text: input.value
    }
    console.log(preparedObject)
    socket.emit('mensajeEnviado', preparedObject)
}      
   
socket.on('chat', data=>{
    let p= document.getElementById('log')
    let mensajes = data.mensajes.map(message=>{
    return `<div><span><b style="color:blue;">${message.user}</b> ${message.hora} dice: <i style="color:green;">${message.message}</i></span></div>`
    }).join('')
    p.innerHTML = mensajes
})

socket.on('messagelog', data=>{
    let p= document.getElementById('log')
    let mensajes = data.map(message=>{
    return `<div><span><b style="color:blue;">${message.user}</b> ${message.hora} dice: <i style="color:green;">${message.message}</i></span></div>`
    }).join('')
    p.innerHTML = mensajes
})

//------------------------------------------------------------------
//submit de producto
document.addEventListener('submit', event=>{
    event.preventDefault()//Se evita que se refresque la página
    let form = document.querySelector('#productForm')
    let data = new FormData(form)//Con esto se envía la informacion al back
   
    
    fetch('http://localhost:8080/api/productos',{
        method: 'POST',
        body: data
    }).then(result=>{
        return result.json()
    }).then(json=>{
        console.log(json)
    })
})
