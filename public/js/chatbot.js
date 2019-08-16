var inputPergunta = document.querySelector(".input-pergunta");

document.querySelector(".btn-enviar").addEventListener("click", e=>{
    e.preventDefault();
    
    fetch("/empresas/rive/NBA", {
        method: 'post',
        body: `pergunta=${inputPergunta.value}`,
        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
      })
    .then(response => response.json()) // retorna uma promise
    .then(json => {
        console.log(json);
    })
    .catch(err => {
    // trata se alguma das promises falhar
    console.error('Failed retrieving information', err);
    });

});