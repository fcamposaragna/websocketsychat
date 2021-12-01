const socket = io()

//------------------------------------------------------------------
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
//-------------------------------------------------------------
//chat

let user = document.getElementById('user')
let input = document.getElementById('mensaje')

function miFunc(){
    let date = new Date()
    let dia =  date.getDay()
    let mes = date.getMonth()
    let año = date.getFullYear()
    let hora = date.getHours()
    let minuto = date.getMinutes()
    let segundo = date.getSeconds()
    
    let formato = `[${dia}/${mes}/${año} ${hora}:${minuto}:${segundo}]`
    
    let preparedObject = {
        user: user.value,
        hora: formato,
        message: input.value
    }
    socket.emit('mensajeEnviado', preparedObject)
}      
   
socket.on('chat', data=>{
    console.log(data)
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
