var inputPergunta = document.querySelector(".input-pergunta");

document.querySelector(".btn-enviar").addEventListener("click", e=>{
    e.preventDefault();

    let mensagem = document.createElement("div");
    mensagem.classList.add("recei-mess__inner");
    mensagem.innerHTML = `							
        <div class="recei-mess-list">
            <div class="recei-mess">${inputPergunta.value}</div>
        </div>
    `;

    document.querySelector(".send-mess-wrap").appendChild(mensagem);
    
    fetch("/empresas/rive/NBA", {
        method: 'post',
        body: `pergunta=${inputPergunta.value}`,
        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
      })
    .then(response => response.json()) // retorna uma promise
    .then(json => {

        let resposta = document.createElement("div");
        resposta.classList.add("send-mess__inner");
        resposta.innerHTML = `
            <div class="send-mess-list">                            
            </div>
            <button>
                <a href="#">
                    <i class="fas fa-thumbs-up btn-thumb btn-thumb-like"></i>
                </a>
            </button>
            <button>
                <i class="fas fa-thumbs-down btn-thumb btn-thumb-dislike"></i>
            </button>
            <div class="send-mess-list">
                <div class="send-mess">
                    ${json}
                </div>
            </div>
            `;
        document.querySelector(".send-mess-wrap").appendChild(resposta);
        console.log(json);
        document.querySelector(".chat").scrollTop = document.querySelector(".chat").scrollHeight;

    })
    .catch(err => {
    // trata se alguma das promises falhar
    console.error('Failed retrieving information', err);
    });

});