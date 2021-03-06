[...document.querySelectorAll(".tr-shadow")].forEach(tr =>{

    tr.querySelector(".btn-delete").addEventListener("click", e=>{

        fetch(`/funcionario/${tr.dataset.cpf}`, {
            method: 'delete',
          })
        .then(response => {
    
            location.reload();
    
        })
        .catch(err => {
            // trata se alguma das promises falhar
            console.error('Failed retrieving information', err);
        });
    });

    tr.querySelector(".btn-edit").addEventListener("click", e=>{

        window.location.href = `/editarFuncionario/?nome=${tr.dataset.nome}&email=${tr.dataset.email}&cpf=${tr.dataset.cpf}`;

    });

})