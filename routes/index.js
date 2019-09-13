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

router.get("/chat/:cnpjEmpresa", function(req, res, next){

  let empresa = new Empresa();

  let cnpjEmpresa = req.params.cnpjEmpresa;

  empresa.getEmpresa(db, cnpjEmpresa).then(results =>{

    res.render("chatbot", {
      title: "chatbot",
      results
    });

  }).catch(err =>{

    res.send(err);

  });

});

/* rotas para arquivos rive*/

router.post("/empresas/rive/:id", function(req, res, next){

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
      //res.send(`Pergunta: ${req.body.pergunta}<br>Bot Responde: ${pao}`);
      res.send(JSON.stringify(pao));
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

// Cadastra pergunta no arquivo .rive
router.get("/pergunta/rive/:CNPJ", function(req, res, next){

  let riveString = `\n+${req.session.enunciado} \r\n-${req.session.resposta}`;
  fs.appendFile(`./rive_files/${req.params.CNPJ}.rive`, riveString, err =>{

    if(err) res.send(err);

    let perg = new pergunta();
    perg.update(db, req.session.idPergunta, {
      pergunta_rive: riveString
    })

    delete req.session.enunciado;
    delete req.session.resposta;
    delete req.session.idPergunta;

    res.redirect("/perguntas");

    //res.send("Dados adicionados com sucesso");

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

});

router.get("/registrarFuncionario", function(req, res, next){

  res.render("regFuncionario", {
    title: "Registrar Funcionário - Projeto Chazelle"
  });

});

router.get("/registrarEmpresa", function(req, res, next){

  res.render("regEmpresa", {
    title: "Registrar Empresa - Projeto Chazelle"
  });

});

/* rota para auxilio de trafego de informações*/
router.post("/saveFuncionario", function(req, res, next){

  req.session.funcionario = Object.assign({administrator: "true"}, req.body);

  res.redirect("/registrarEmpresa");

});

router.post("/registrarEmpresa", function(req, res, next){

  let empresa = new Empresa();

  empresa.save(db, {
    CNPJ_empresa: req.body.CNPJ,
    nome_empresa: req.body.nome,
    email_empresa: req.body.email,
    ramo_empresa: req.body.ramo
  }).then(result =>{

    let func = new Funcionario();

    //console.log(req.body.nome);

    func.save(db, {
      nome_funcionario: req.session.funcionario.nome,
      CNPJ_empresa: req.body.CNPJ,
      CPF_funcionario: req.session.funcionario.CPF,
      email_funcionario: req.session.funcionario.email,
      senha_funcionario: req.session.funcionario.senha,
      isAdministrator_funcionario: req.session.funcionario.administrator,
      
    }).then(result =>{
      // console.log(req.session.funcionario);

      // req.session.user = req.session.funcionario,

      delete req.session.funcionario;
      
      res.redirect("/login");

    }).catch(err =>{

      console.log(err);

      res.render("regEmpresa", {
        err: "Houve um erro ao cadastrar os dados!",
        title: ""
      });

    });

  }).catch(err =>{

    console.log(err);

    res.render("regEmpresa", {
      err: "Houve um erro ao cadastrar os dados!",
      title: ""
    });

  });

});

router.use(function(req, res, next){

  if(["/login", "/registrarFuncionario", "/saveFuncionario", "/registrarEmpresa"].indexOf(req.url) === -1 && !req.session.user) {

    res.redirect("/login");

  } else {

    next();

  }

});

/* GET home page. */
router.get('/', function(req, res, next) {
  
  //req.session.user = "ok";
  db.database();
  res.render('index', { title: 'Express' });
  
});

router.get("/index", function(req, res, next){

  console.log(req.session.user);
  res.render("index", {
    title: 'Projeto Chazelle',
    user: req.session.user
  });

});

router.get("/login", function(req, res, next){

  //console.log(req.session.user.CNPJ_empresa);
  res.render("login", {
    title: "Login - Projeto Chazelle"
  });

});

router.post("/login", function(req, res, next){

  Funcionario.checkLogin(db, req.body.email, req.body.password).then(results =>{

    req.session.user = results;
    //console.log(results);
    res.redirect("/index");

  }).catch(error =>{
    //console.log(error);
    res.redirect("/login");
  });

});

router.get("/logout", function(req, res, next){

  delete req.session.user;
  res.redirect("/login");

});


router.get("/funcionarios", function(req, res, next){

  Funcionario.getAllFunctionarios(db, req.session.user.CNPJ_empresa).then(results =>{

    // results.forEach(oi =>{
    //   console.log(oi.data());
    // });

    // // res.send(results[0].id);
    // res.send(results);

    res.render("listarFuncionarios", {
      results,
      user: req.session.user,
      title: "Funcionários"
    });


  }).catch(err =>{

    res.render("listarFuncionarios", {
      err,
      user: req.session.user
    });

  });

});

router.get("/perguntas", function(req, res, next){

  pergunta.getAllPerguntas(db, req.session.user.CNPJ_empresa).then(results =>{

    // results.forEach(oi =>{
    //   console.log(oi.data());
    // });

    // // res.send(results[0].id);
    // res.send(results);

    res.render("listarPerguntas", {
      title: "Projeto Chazelle",
      results,
      user: req.session.user
    });


  }).catch(err =>{

    res.render("listarPerguntas", {
      title: "Projeto Chazelle",
      err,
      user: req.session.user
    });

  });

});

router.get("/cadastrarFuncionario", function(req, res, next){

  res.render("cadFuncionario", {
    title: 'Projeto Chazelle',
    user: req.session.user
  });

});

router.get("/cadastrarPergunta", function(req, res, next){

  res.render("cadPergunta", {
    title: 'Projeto Chazelle',
    user: req.session.user
  });

});

router.get("/editarPergunta", function(req, res, next){
    res.render("edtPergunta", {
      title: 'Projeto Chazelle',
      user: req.session.user,
      pergEnunciado: req.query.enunciado,
      pergResposta: req.query.resposta,
      pergId: req.query.id
    });

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

    // results.forEach(oi =>{
    //   console.log(oi.data());
    // });

    //res.send(results[0].id);
    res.send(results);


  }).catch(err =>{

    res.send(err);

  })

});

router.get("/perguntas/:cnpj", function(req, res, next){

  pergunta.getAllPerguntas(db, req.params.cnpj).then(results =>{

    // results.forEach(oi =>{
    //   console.log(oi.data());
    // });

    // res.send(results[0].data());
    res.send(results);


  }).catch(err =>{
    
    res.send(err);

  })

});


/* rotas para cadastro */
router.post("/funcionario", function(req, res, next){

  let func = new Funcionario();

  //console.log(req.body.nome);

  func.save(db, {
    nome_funcionario: req.body.nome,
    CNPJ_empresa: req.body.cnpj,
    CPF_funcionario: req.body.cpf,
    email_funcionario: req.body.email,
    senha_funcionario: req.body.senha,
    isAdministrator_funcionario: req.body.administrator,
    
  }).then(result =>{
    res.redirect("/funcionarios");
  }).catch(err =>{
    console.log(err);
    res.send(err);
  });

});


router.post("/pergunta", function(req, res, next){

  let perg = new pergunta();

  perg.save(db, {
    CNPJ_pergunta: req.session.user.CNPJ_empresa,
    enunciado_pergunta: req.body.enunciado,
    //pergunta_rive: req.body.perguntaRive,
    resposta_pergunta: req.body.resposta
  }).then(result =>{
    req.session.enunciado = req.body.enunciado;
    req.session.resposta = req.body.resposta;
    req.session.idPergunta = result.id;
    res.redirect(`/pergunta/rive/${req.session.user.CNPJ_empresa}`);
  }).catch(err =>{
    console.log(err);
    res.send(err);
  });

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

  perg.update(db, req.params.id, {
    CNPJ_pergunta: req.session.user.CNPJ_empresa,
    enunciado_pergunta: req.body.enunciado,
    //pergunta_rive: req.body.perguntaRive,
    resposta_pergunta: req.body.resposta
  }).then(results => {
    res.redirect("/perguntas");
  }).catch(err =>{
    console.log(err.message);
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


module.exports = router;
