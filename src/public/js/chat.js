const socket = io()
fetch('/currentUser').then(result=>result.json()).then(json=>{
    let hi = document.getElementById("hi")
    let user = json.alias
    hi.innerHTML= `Hola ${user}`
        
})
let input = document.getElementById('mensaje');
input.addEventListener('keyup',(event)=>{
    if(event.key==="Enter"){
        fetch('/currentUser').then(result=>result.json()).then(json=>{
            if(event.target.value){
                socket.emit('mensajeEnviado',{message:event.target.value})
                event.target.value="";
            }
            let user = json;
            console.log(user);
        }).catch(()=>{
            alert('Su sesión ha expirado')
            location.replace('../pages/login.html')
        })
        
    }
})
function sendMessage(){
    if(input.value){
        fetch('/currentUser').then(result=>result.json()).then(json=>{
            
        })
    }
}
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
    console.log(data)
    let mensajes = data.payload.map(message=>{
    return `<div><span><img src='${message.author.avatar}' id='imagen-chat' ><b style="color:blue;">${message.author.alias}</b> dice: <i style="color:green;">${message.text}</i></span></div>`
    }).join('')
    p.innerHTML = mensajes
})