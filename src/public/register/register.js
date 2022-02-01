let form  = document.getElementById("registerForm");
form.addEventListener('submit',function(event){
    event.preventDefault();
    let info = new FormData(form);
    let sendObject ={
        nombre:info.get('nombre'),
        apellido:info.get('apellido'),
        edad:info.get('edad'),
        alias:info.get('alias'),
        email:info.get('email'),
        avatar:info.get('avatar'),
        password:info.get('contraseña')
    }
    fetch('/register',{
        method:"POST",
        body:JSON.stringify(sendObject),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=>result.json()).then(json=>{
        form.reset();
        alert('Usuario creado!');
    })
})