var inputPergunta = document.querySelector(".input-pergunta");
var cnpj = document.querySelector(".cnpj_empresa").outerText;


document.querySelector(".btn-enviar").addEventListener("click", e=>{
    e.preventDefault();
    
    let pergunta = inputPergunta.value.toLowerCase().replace(/[.*+?^${}()|[\]\\,;!]/g, "");
    let mensagem = document.createElement("div");
    mensagem.classList.add("recei-mess__inner");
    mensagem.innerHTML = `							
        <div class="recei-mess-list">
            <div class="recei-mess">${inputPergunta.value}</div>
        </div>
    `;

    document.querySelector(".send-mess-wrap").appendChild(mensagem);
    
    fetch(`/empresas/rive/${cnpj}`, {
        method: 'post',
        body: `pergunta=${pergunta}`,
        headers: { 'Content-type': 'application/x-www-form-urlencoded' }
      })
    .then(response => response.json()) // retorna uma promise
    .then(json => {

        if(json == "ERR: No Reply Matched") json = "Tente reformular sua pergunta";
        let resposta = document.createElement("div");
        resposta.classList.add("send-mess__inner");
        resposta.dataset.pergunta = inputPergunta.value;
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
        resposta.querySelector(".fa-thumbs-up").addEventListener("click", e =>{

            let textoResposta = e.target.parentElement.parentElement.parentElement.querySelector(".send-mess").outerText;
            console.log(textoResposta);
            fetch(`/pergunta/like`, {
                method: 'post',
                body: `resposta=${textoResposta}`,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
              })
            .then(response => {
                console.log("Funfou");
            })
            .catch(err => {
                console.error('Failed retrieving information', err);
            });

        });
        resposta.querySelector(".fa-thumbs-down").addEventListener("click", e =>{

            let textoResposta = e.target.parentElement.parentElement.querySelector(".send-mess").outerText;
            console.log(textoResposta);
            fetch(`/pergunta/dislike`, {
                method: 'post',
                body: `resposta=${textoResposta}`,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
              })
            .then(response => {
                console.log("Funfou");
            })
            .catch(err => {
                console.error('Failed retrieving information', err);
            });
            
        });

        console.log(json);
        document.querySelector(".chat-scroll").scrollTop = document.querySelector(".chat").scrollHeight;
        inputPergunta.value = "";

    })
    .catch(err => {
    // trata se alguma das promises falhar
    console.error('Failed retrieving information', err);
    });

});

