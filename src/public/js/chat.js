const socket = io()

let user;
fetch('/currentUser').then(result=>result.json()).then(json=>{
    user = json;
    console.log(user);
})

let input = document.getElementById('mensaje');
input.addEventListener('keyup',(event)=>{
    if(event.key==="Enter"){
        if(event.target.value){
            socket.emit('mensajeEnviado',{message:event.target.value})
            event.target.value="";
        }
    }
})
// function miFunc(){
//     const input = document.getElementById('mensaje')
//     let text = input.ariaValueMax
//     console.log(text)
//     socket.emit('mensajeEnviado', text)
// }

socket.on('chat', data=>{
    let p= document.getElementById('log')
    let mensajes = data.payload.map(message=>{
    return `<div><span><img src="${message.author.avatar}" id='imagen-chat'><b style="color:blue;">${message.author.alias}</b> dice: <i style="color:green;">${message.text}</i></span></div>`
    }).join('')
    p.innerHTML = mensajes
})

socket.on('messagelog', data=>{
    let p= document.getElementById('log')
    
    let mensajes = data.payload.map(message=>{
    return `<div><span><img src='${message.author.avatar}' id='imagen-chat' ><b style="color:blue;">${message.author.alias}</b> dice: <i style="color:green;">${message.text}</i></span></div>`
    }).join('')
    p.innerHTML = mensajes
})