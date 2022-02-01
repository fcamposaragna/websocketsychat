fetch('/currentUser').then(result=>result.json()).then(json=>{
    let header = document.getElementById("goodbye")
    header.innerHTML= `Hasta luego ${json.alias}`
})