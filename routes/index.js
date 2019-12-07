var express = require('express');
var router = express.Router();
var firestore = require("./../public/models/firestore");
var db = new firestore();
var pergunta = require("./../public/models/Pergunta");
var Funcionario = require("./../public/models/Funcionario");
var Empresa = require("./../public/models/Empresa");
var rive = require("./../public/js/rive.js");
var replace = require('replace-in-file');
var rivescript = require("rivescript");
var fs = require("fs");
var chalk = require("chalk");


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

router.post("/pergunta/like", (req, res, next)=>{

  let perg = new pergunta();

  console.log(req.body);

  perg.addLike(db, req.body.resposta).then(()=>{
    res.send("Funfou");

  }).catch((error)=>{
    console.log(error);
    res.send("Não funfou");
  });

});

router.post("/pergunta/dislike", (req, res, next)=>{

  let perg = new pergunta();
  
  console.log(req.body);

  perg.addDislike(db, req.body.resposta).then(()=>{
    res.send("Funfou");

  }).catch((error)=>{
    console.log(error);
    res.send("Não funfou");
  });

});

/* rotas para arquivos rive*/

router.post("/empresas/rive/:id", function(req, res, next){

  var bot = new rivescript({utf8: true});
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
      let resp = reply;
      //res.send(`Pergunta: ${req.body.pergunta}<br>Bot Responde: ${pao}`);
      res.send(JSON.stringify(resp));
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

      fs.appendFile(`./rive_files/${req.body.CNPJ}.rive`, "", function (err){
        if (err) throw err;
        console.log('Saved!');
      });

      delete req.session.funcionario;
      
      res.redirect("/login");

    }).catch(err =>{

      console.log(err);

      empresa.delete(db, req.body.CNPJ).then(()=>{
        console.log();
      }).catch(err=>{
        console.log(err);
      });

      delete req.session.funcionario;

      res.render("regFuncionario", {
        title: "Registrar Funcionário",
        error: err
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
  
  let perg = new pergunta();

  console.log(req.session.user);

  pergunta.getByLimit(db, req.session.user.CNPJ_empresa, 5).then(results =>{

    console.log(results);
    perg.count(db, req.session.user.CNPJ_empresa).then((resultsCount)=>{

      res.render("index", {
        title: "Projeto Chazelle",
        results,
        numPerguntas: resultsCount.numPerguntas,
        numLikes: resultsCount.numLikes,
        numDislikes: resultsCount.numDislikes,
        numTotal: resultsCount.numTotal,
        user: req.session.user
      });

    }).catch(()=>{

      res.render("index", {
        title: "Projeto Chazelle",
        results,
        user: req.session.user
      });

    });
  
  });

});

router.get("/index", function(req, res, next){

  let perg = new pergunta();

  console.log(req.session.user);

  pergunta.getByLimit(db, req.session.user.CNPJ_empresa, 5).then(results =>{

    perg.count(db, req.session.user.CNPJ_empresa).then((resultsCount)=>{

      res.render("index", {
        title: "Projeto Chazelle",
        results,
        numPerguntas: resultsCount.numPerguntas,
        numLikes: resultsCount.numLikes,
        numDislikes: resultsCount.numDislikes,
        numTotal: resultsCount.numTotal,
        user: req.session.user
      });

    }).catch((err)=>{
      console.log(err);
      res.render("index", {
        title: "Projeto Chazelle",
        results,
        user: req.session.user
      });

    });


  }).catch(err =>{

    res.render("index", {
      title: "Projeto Chazelle",
      error: err,
      user: req.session.user
    });

  });

  // res.render("index", {
  //   title: 'Projeto Chazelle',
  //   user: req.session.user
  // });

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
      error: err,
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

router.get("/editarFuncionario", function(req, res, next){
  
  res.render("edtFuncionario", {
    title: 'Editar Funcionário',
    user: req.session.user,
    nome: req.query.nome,
    email: req.query.email,
    cpf: req.query.cpf
  });

});

router.get("/editarSenha", function(req, res, next){
  
  res.render("edtSenha", {
    title: "Alterar Senha",
    user: req.session.user
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
    console.log("fasjiofjasiasfjasiojasfioasjioasfjoasfijiaso ", err);
    res.render("cadFuncionario", {
      title: 'Projeto Chazelle',
      user: req.session.user,
      error: err
    });

  });

});


router.post("/pergunta", function(req, res, next){

  let perg = new pergunta();

  req.body.enunciado = req.body.enunciado.toLowerCase().replace(/[.*+?^${}()|[\]\\,;!]/g, "");

  perg.save(db, {
    CNPJ_pergunta: req.session.user.CNPJ_empresa,
    enunciado_pergunta: req.body.enunciado,
    //pergunta_rive: req.body.perguntaRive,
    resposta_pergunta: req.body.resposta,
    likes_pergunta: 0,
    dislikes_pergunta: 0
  }).then(result =>{
    req.session.enunciado = req.body.enunciado;
    req.session.resposta = req.body.resposta;
    req.session.idPergunta = result.id;

    rive.insert(req.body.enunciado, req.body.resposta, req.session.user.CNPJ_empresa).then(()=>{
      res.redirect("/perguntas");
    }).catch((err)=>{
      res.redirect("/perguntas");
    });

  }).catch(err =>{
    console.log(err);
    res.render("cadPergunta", {
      title: "Projeto Chazelle",
      error: err,
      user: req.session.user
    });
  });

});


/* rotas para atualização */
router.post("/funcionario/:id", function(req, res, next){

  let func = new Funcionario();

  func.update(db, req.params.id, {
    nome_funcionario: req.body.nome,
    email_funcionario: req.body.email
  }).then(result =>{
    console.log(result);
    res.render("edtFuncionario", {
      title: "Editar Funcionário",
      cpf: req.session.user.CPF_funcionario,
      nome: req.body.nome,
      email: req.body.email,
      user: req.session.user,
      success: "Dados editados com sucesso!"
    });

  }).catch(err =>{
    console.log(err);
    res.render("edtFuncionario", {
      title: "Editar Funcionário",
      user: req.session.user,
      cpf: req.params.id,
      nome: req.body.nome,
      email: req.body.email,
      error: err
    });
    
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
  let pergResp;
  req.body.enunciado = req.body.enunciado.toLowerCase().replace(/[.*+?^${}()|[\]\\,;!]/g, "");
  
  perg.getPergunta(db, req.params.id).then((result)=>{

    pergResp = result;
    console.log(pergResp);

      perg.update(db, req.params.id, {
        CNPJ_pergunta: req.session.user.CNPJ_empresa,
        enunciado_pergunta: req.body.enunciado,
        //pergunta_rive: req.body.perguntaRive,
        resposta_pergunta: req.body.resposta,
        likes_pergunta: 0,
        dislikes_pergunta: 0
      }).then(results => {
          rive.update(pergResp.enunciado_pergunta, pergResp.resposta_pergunta, req.body.enunciado, req.body.resposta, req.session.user.CNPJ_empresa).then(()=>{
          res.redirect("/perguntas");
        }).catch((err)=>{
          res.render("edtPergunta", {
            title: "Projeto Chazelle",
            error: err,
            user: req.session.user,
            pergId: req.params.id,
            pergEnunciado: req.body.enunciado,
            pergResposta: req.body.resposta
          });
        });
      }).catch(err =>{
        res.render("edtPergunta", {
          title: "Projeto Chazelle",
          error: err,
          user: req.session.user,
          pergId: req.params.id,
          pergEnunciado: req.body.enunciado,
          pergResposta: req.body.resposta
        });
      });

  }).catch((err)=>{

    res.render("edtPergunta", {
      title: "Projeto Chazelle",
      error: err,
      user: req.session.user,
      pergId: req.params.id,
      pergEnunciado: req.body.enunciado,
      pergResposta: req.body.resposta
    });

  });

});

router.post("/senha/:cpf", function(req, res, next){

  let func = new Funcionario();

  func.updateSenha(db, req.body.senhaAntiga, req.body.senhaNova, req.params.cpf).then(()=>{

    res.render("edtSenha", {
      title: "Editar Senha",
      user: req.session.user,
      success: "Senha alterada com sucesso!"
    });

  }).catch((error)=>{

    res.render("edtSenha", {
      title: "Editar Senha",
      user: req.session.user,
      error
    });

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

router.delete("/pergunta/:id", function(req, res, next){

  let perg = new pergunta();

  let pergResp;

  perg.getPergunta(db, req.params.id).then((result)=>{

    pergResp = result;

  }).catch((err)=>{

    console.log(error);

  });

  perg.delete(db, req.params.id).then((results) =>{

    rive.delete(pergResp.enunciado_pergunta, pergResp.resposta_pergunta, req.session.user.CNPJ_empresa).then(()=>{
      res.redirect("/perguntas");
    }).catch((err)=>{
      console.log(err);
    });

  }).catch(err =>{

    res.send(err);

  });

});


module.exports = router;
