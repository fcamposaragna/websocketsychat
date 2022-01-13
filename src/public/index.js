const socket = io()

//chat
const email = document.getElementById('email')
const first = document.getElementById('Nombre')
const apellido = document.getElementById('apellido')
const edad = document.getElementById('edad')
const alias = document.getElementById('alias')
const input = document.getElementById('mensaje')
const avatar = document.getElementById('avatar')

function miFunc(){
    let preparedObject = {
        author:{
            id: email.value,
            nombre: first.value,
            apellido: apellido.value,
            edad: edad.value,
            alias: alias.value,
            avatar: avatar.value,
        },
        text: input.value
    }
    socket.emit('mensajeEnviado', preparedObject)
}      
   
socket.on('chat', data=>{
    let p= document.getElementById('log')
    let mensajes = data.payload.map(message=>{
    return `<div><span><img src="${message.author.avatar}" id='imagen-chat'><b style="color:blue;">${message.author.alias}</b> dice: <i style="color:green;">${message.text}</i></span></div>`
    }).join('')
    p.innerHTML = mensajes
})

socket.on('messagelog', data=>{
    let p= document.getElementById('log')
    console.log(data)
    let mensajes = data.payload.map(message=>{
    return `<div><span><img src='${message.author.avatar}' id='imagen-chat' ><b style="color:blue;">${message.author.alias}</b> dice: <i style="color:green;">${message.text}</i></span></div>`
    }).join('')
    p.innerHTML = mensajes
})