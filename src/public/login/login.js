let form = document.getElementById('loginForm');
form.addEventListener('submit',function(event){
    event.preventDefault();
    let info = new FormData(form);
    let sendObject={
        email:info.get('email'),
        password:info.get('contraseña')
    }
    console.log(sendObject)
    fetch('/login',{
        method:"POST",
        body:JSON.stringify(sendObject),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>{
        if(result.status===404){
            return window.alert('Usuario o contraseña inválidos')
         }
         else{
             location.replace('../pages/chat.html')
         }
    })
})