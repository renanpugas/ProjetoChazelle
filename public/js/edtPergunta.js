document.querySelector("textarea#enunciado").addEventListener("keyup", e=>{

    let textAreaEnunciado = document.querySelector("small.enunciado");

    let caracteresRestantes = (255 - e.currentTarget.value.length);

    textAreaEnunciado.innerHTML = `${caracteresRestantes} caracteres restantes`;

});

document.querySelector("textarea#resposta").addEventListener("keyup", e=>{

    let textAreaEnunciado = document.querySelector("small.resposta");

    let caracteresRestantes = (255 - e.currentTarget.value.length);

    textAreaEnunciado.innerHTML = `${caracteresRestantes} caracteres restantes`;

});