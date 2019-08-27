[...document.querySelectorAll(".tr-shadow")].forEach(tr =>{

    tr.querySelector(".btn-delete").addEventListener("click", e=>{

        fetch(`/pergunta/${tr.dataset.id}`, {
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

})