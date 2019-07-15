var express = require('express');
var router = express.Router();
var firestore = require("./../public/models/firestore");
var db = new firestore();
var pergunta = require("./../public/models/Pergunta");
var Funcionario = require("./../public/models/Funcionario");
var Empresa = require("./../public/models/Empresa");

/* GET home page. */
router.get('/', function(req, res, next) {
  
  db.database();
  res.render('index', { title: 'Express' });
  
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
router.get("/chat/:empresa", function(req, res, next){



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
  })

});

router.get("/empresa/:id", function(req, res, next){



});

router.get("/pergunta/:idPergunta", function(req, res, next){

  let perg = new pergunta();
  
  perg.getPergunta(db, req.params.idPergunta).then(results => {
    res.send(results);
  }).catch(err =>{
    res.send(err);
  });

});

router.get("/funcionarios", function(req, res, next){

  Funcionario.getAllFunctionarios(db).then(results =>{

    results.forEach(oi =>{
      console.log(oi.data());
    });

    res.send(results[0].id);

  }).catch(err =>{

    res.send(err);

  });

});

router.get("/empresas", function(req, res, next){

  Empresa.getAllEmpresas(db).then(results =>{

    results.forEach(oi =>{
      console.log(oi.data());
    });

    res.send(results[0].id);


  }).catch(err =>{


  })

});

router.get("/perguntas/:cnpj", function(req, res, next){

  pergunta.getAllPerguntas(db, req.params.cnpj).then(results =>{

    results.forEach(oi =>{
      console.log(oi.data());
    });

    res.send(results[0].data());


  }).catch(err =>{


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

  empresa.save(db, data).then(result =>{
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

/* rotas para exclusão */
router.delete("/funcionario/:id", function(req, res, next){

});

router.delete("/empresa", function(req, res, next){

});

router.delete("/pergunta/:id", function(req, res, next){

});

module.exports = router;
