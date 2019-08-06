var express = require('express');
var router = express.Router();
var firestore = require("./../public/models/firestore");
var db = new firestore();
var pergunta = require("./../public/models/Pergunta");
var Funcionario = require("./../public/models/Funcionario");
var Empresa = require("./../public/models/Empresa");
const replace = require('replace-in-file');
var rivescript = require("rivescript");
var fs = require("fs");


/* GET home page. */
router.get('/', function(req, res, next) {
  
  db.database();
  res.render('index', { title: 'Express' });
  
});

router.get("/index", function(req, res, next){

  res.render("index");

});

router.get("/funcionarios", function(req, res, next){

  Funcionario.getAllFunctionarios(db).then(results =>{

    // results.forEach(oi =>{
    //   console.log(oi.data());
    // });

    // // res.send(results[0].id);
    // res.send(results);

    res.render("listarFuncionarios", {
      results
    });


  }).catch(err =>{

    res.render("listarFuncionarios", {
      err
    });

  });

});

router.get("/perguntas", function(req, res, next){

  pergunta.getAllPerguntas(db, "4o0zhjwVQQo3wUFNyFuK").then(results =>{

    // results.forEach(oi =>{
    //   console.log(oi.data());
    // });

    // // res.send(results[0].id);
    // res.send(results);

    res.render("listarPerguntas", {
      results
    });


  }).catch(err =>{

    res.render("listarPerguntas", {
      err
    });

  });

});

router.get("/cadastrarFuncionario", function(req, res, next){

  res.render("cadFuncionario");

});

router.get("/cadastrarPergunta", function(req, res, next){

  res.render("cadPergunta");

});

router.get('/ola', function(req, res, next) {

  // let func = new Funcionario();

  // func.getFuncionario(db, req.params.cpf).then(result =>{
  //   res.send(result);
  // }).catch(err =>{
  //   res.send(err);
  // });

  let perg = new pergunta();

  perg.update(db, "EANK9KTHKa2A2ugvDsOb", {
    CNPJ_pergunta: "4o0zhjwVQQo3wUFNyFuK",
    enunciado_pergunta: "oila",
    pergunta_rive: "ola",
    resposta_pergunta: "blz"
  }).then(results => {
    res.send(results);
  }).catch(err =>{
    res.send(err);
  });
  
});

//rota destinada a pagina de chat
router.get("/:nomeEmpresa", function(req, res, next){

  res.render("chatbot");

});

/* rotas para consulta*/
router.get("/funcionario/:cpf", function(req, res, next){

  let func = new Funcionario();

  func.getFuncionario(db, req.params.cpf).then(result =>{
    res.send(result);
  }).catch(err =>{
    res.send(err);
  });

});

router.get("/empresa/:cnpj", function(req, res, next){

  let empresa = new Empresa();

  empresa.getEmpresa(db, req.param.cnpj).then(result =>{
    res.send(result);
  }).catch(err =>{
    res.send(err);
  });

});

router.get("/pergunta/:idPergunta", function(req, res, next){

  let perg = new pergunta();
  
  perg.getPergunta(db, req.params.idPergunta).then(results => {
    res.send(results);
  }).catch(err =>{
    res.send(err);
  });

});


router.get("/empresas", function(req, res, next){

  Empresa.getAllEmpresas(db).then(results =>{

    results.forEach(oi =>{
      console.log(oi.data());
    });

    //res.send(results[0].id);
    res.send(results);


  }).catch(err =>{

    res.send(err);

  })

});

router.get("/perguntas/:cnpj", function(req, res, next){

  pergunta.getAllPerguntas(db, req.params.cnpj).then(results =>{

    results.forEach(oi =>{
      console.log(oi.data());
    });

    // res.send(results[0].data());
    res.send(results);


  }).catch(err =>{
    
    res.send(err);

  })

});

/* rotas para cadastro */
router.post("/funcionario", function(req, res, next){

  let func = new Funcionario();

  func.save(db, {
    CNPJ_empresa: req.body.CNPJ,
    CPF_funcionario: req.body.cpf,
    isAdministrator_funcionario: req.body.isAdministrator,
    nome_funcionario: req.body.nome
  }).then(result =>{
    res.send("funfou");
  }).catch(err =>{
    console.log(err);
    res.send(err);
  });

});

router.post("/empresa", function(req, res, next){

  let empresa = new Empresa();

  empresa.save(db, {
    CNPJ_empresa: req.body.CNPJ,
    nome_empresa: req.body.nome,
    ramo_empresa: req.body.ramo
  }).then(result =>{
    res.send(result);
  }).catch(err =>{
    res.send(err);
  });

});

router.post("/pergunta", function(req, res, next){

  let perg = new pergunta();

  perg.save(db, {
    CNPJ_pergunta: req.body.CNPJ,
    enunciado_pergunta: req.body.enunciado,
    pergunta_rive: req.body.perguntaRive,
    resposta_pergunta: req.body.resposta
  }).then(results => {
    res.send(results);
  }).catch(err =>{
    res.send(err);
  });

});

router.post("/empresa/:nome", function(req, res, next){

  fs.app

});

/* rotas para atualização */
router.post("/funcionario/:id", function(req, res, next){

  let func = new Funcionario();

  func.save(db, req.params.id, {
    CNPJ_empresa: req.body.CNPJ,
    CPF_funcionario: req.body.cpf,
    isAdministrator_funcionario: req.body.isAdministrator,
    nome_funcionario: req.body.nome
  }).then(result =>{
    res.send("funfou");
  }).catch(err =>{
    console.log(err);
    res.send(err);
  });

});

router.post("/empresa/:id", function(req, res, next){

  let empresa = new Empresa();

  empresa.save(db, req.params.id, {
    CNPJ_empresa: req.body.CNPJ,
    nome_empresa: req.body.nome,
    ramo_empresa: req.body.ramo
  }).then(result =>{
    res.send(result);
  }).catch(err =>{
    res.send(err);
  });

});

router.post("/pergunta/:id", function(req, res, next){

  let perg = new pergunta();

  perg.save(db, req.params.id, {
    CNPJ_pergunta: req.body.CNPJ,
    enunciado_pergunta: req.body.enunciado,
    pergunta_rive: req.body.perguntaRive,
    resposta_pergunta: req.body.resposta
  }).then(results => {
    res.send(results);
  }).catch(err =>{
    res.send(err);
  });

});


/* rotas para exclusão */
router.delete("/funcionario/:id", function(req, res, next){

  let func = new Funcionario();

  func.delete(db, req.params.id).then((results) =>{

    res.send(results);

  }).catch(err =>{

    res.send(err);

  });

});

router.delete("/empresa", function(req, res, next){

});

router.delete("/pergunta/:id", function(req, res, next){

  let perg = new pergunta();

  perg.delete(db, req.params.id).then((results) =>{

    res.send(results);

  }).catch(err =>{

    res.send(err);

  });

});

/* rotas para arquivos rive*/

router.get("/empresa/rive/:id", function(req, res, next){

  var bot = new rivescript();
  var resposta = "";

  bot.loadFile(`./rive_files/${req.params.id}.rive`).then(loading_done).catch(loading_error);

  function loading_done() {
    console.log("Bot has finished loading!");
   
    // Now the replies must be sorted!
    bot.sortReplies();
   
    // And now we're free to get a reply from the brain!
   
    // RiveScript remembers user data by their username and can tell
    // multiple users apart.
    let username = "local-user";
   
    // NOTE: the API has changed in v2.0.0 and returns a Promise now.
    bot.reply(username, req.body.pergunta).then(function(reply) {
      console.log("The bot says: " + reply);
      let pao = reply;
      res.send(`Pergunta: ${req.body.pergunta}<br>
            Bot Responde: ${pao}`);
    }).catch(error =>{
      res.send(error);
    });
  }
   
  // It's good to catch errors too!
  function loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
    res.send(error);
  }

});

router.post("/empresa/rive/:id", function(req, res, next){

  fs.appendFile(`./rive_files/${req.params.id}.rive`, "ola \r\n", err =>{

    if(err) res.send(err);

    res.send("Dados adicionados com sucesso");

  });

});

// Altera pergunta e resposta no arquivo .rive
router.put("/empresa/rive/:id", function(req, res, next){

  var pergOriginal = req.body.perguntaOriginal;
  var respOriginal = req.body.respostaOriginal;
  var pergNova = req.body.perguntaNova;
  var respNova = req.body.respostaNova
  var regex = new RegExp("\\+" + pergOriginal + "\\n\\-" + respOriginal, "g");

  let options1 = {
    files: `rive_files/${req.params.id}.rive`,
    from: regex,
    to: `+${pergNova}\n-${respNova}`,
  };

  console.log(regex);

  replace(options1).then(results => {

    //const changedFiles = results.filter(result => result.hasChanged).map(result => result.file);

    let fileHasChanged = JSON.stringify(results);
    fileHasChanged.includes(`"hasChanged":false`) ? console.log("false") : console.log("true");

    let ola = JSON.stringify(results).replace("[", "").replace("]", "").replace(`"f`, "f").replace(`e"`, "e").replace(`"h`, "h").replace(`d"`, "d").replace("{", "").replace("}", "");
    //let oi = JSON.parse(ola);
    //oi.replace("]", "");
    //let ola = JSON.parse(oi);
    console.log(fileHasChanged);

    res.send(results);
    
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });

});

// Exclui pergunta no arquivo .rive
router.delete("/empresa/rive/:id", function(req, res, next){

  var teste1 = req.body.perguntaOriginal;
  var teste2 = req.body.respostaOriginal;
  var regex = new RegExp("\\+" + teste1 + "\\n\\-" + teste2, "g");

  let options1 = {
    files: `rive_files/${req.params.id}.rive`,
    from: regex,
    to: "",
  };

  console.log(regex);

  replace(options1).then(results => {

    //const changedFiles = results.filter(result => result.hasChanged).map(result => result.file);

    let fileHasChanged = JSON.stringify(results);
    fileHasChanged.includes(`"hasChanged":false`) ? console.log("false") : console.log("true");

    let ola = JSON.stringify(results).replace("[", "").replace("]", "").replace(`"f`, "f").replace(`e"`, "e").replace(`"h`, "h").replace(`d"`, "d").replace("{", "").replace("}", "");
    //let oi = JSON.parse(ola);
    //oi.replace("]", "");
    //let ola = JSON.parse(oi);
    console.log(fileHasChanged);

    res.send(results);
    
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });

});

router.get("/paocomovo", function(req, res, next){

  fs.readFile('rive_files/leroymerlin.rive', 'utf8', (err, data) => {
    if(err) {
        console.log('An error occured', err);
    }

    // const regex = new RegExp('/\+\' + "oi" + '\n\-\', 'i');

    // /\+\oi\n\-\oila/g
    let backgroundColorToReplace = data.replace(/\+\oi\n\-\oila/g, "+oila\n-pao");

    fs.writeFile('rive_files/leroymerlin.rive', backgroundColorToReplace, (err) => {
        if(err) {
             console.log('An error occured', err);
        }

        console.log('Colors successfully changed');
    });
});



var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('rive_files/leroymerlin.rive'),
});

lineReader.on('line', function (line) {
  //ws.write("oi");
  console.log('Line from file:', line);
});



res.send("oi");


});


router.get("/testeRive", function(req, res, next){

  var teste1 = "oi";
  var teste2 = "oila"
  var regex = new RegExp("\\+\\" + teste1 + "\\n\\-\\" + teste2, "g");

  const options = {
    files: 'rive_files/leroymerlin.rive',
    from: /\+\oi\n\-\oila/g,
    to: '+pao\n-vaiCorinthians',
  };


  replace(options)
  .then(results => {

    const changedFiles = results
  .filter(result => result.hasChanged)
  .map(result => result.file);


    let fileHasChanged = JSON.stringify(results);
    fileHasChanged.includes(`"hasChanged":false`) ? console.log("false") : console.log("true");

    let ola = JSON.stringify(results).replace("[", "").replace("]", "").replace(`"f`, "f").replace(`e"`, "e").replace(`"h`, "h").replace(`d"`, "d").replace("{", "").replace("}", "");
    //let oi = JSON.parse(ola);
    //oi.replace("]", "");
    //let ola = JSON.parse(oi);
    console.log(fileHasChanged);

    res.send(results);
    
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });

});

router.post("/empresa/rive/:id", function(req, res, next){

})

module.exports = router;
