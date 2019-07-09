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

  // db.database().collection("users").add({
  //   first: "Alan",
  //   middle: "Mathison",
  //   last: "Turing",
  //   born: 1912
  // })
  // .then(function(docRef) {
  //     console.log("Document written with ID: ", docRef.id);
  // })
  // .catch(function(error) {
  //     console.error("Error adding document: ", error);
  // });;

  //   res.render('index', { title: 'Express' });

  pergunta.save(db).then(result =>{
    res.send("funfou");
  }).catch(err =>{
    console.log(err);
    res.send("não funfou");
  });
  
});

//rota destinada a pagina de chat
router.get("/chat/:empresa", function(req, res, next){



});

/* rotas para consulta*/
router.get("/funcionario/:cpf", function(req, res, next){

  let func = new Funcionario();

  func.getFuncionario(db, req.param.cpf).then(result =>{
    res.send(result);
  }).catch(err =>{
    res.send(err);
  })

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

/* rotas para cadastro */
router.post("/funcionario", function(req, res, next){

  let func = new Funcionario();

  func.save(db, {
    CNPJ_empresa: "848845456",
    CPF_funcionario: "14282as8090",
    isAdministrator_funcionario: true,
    nome_funcionario: "Fulana"
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

});

/* rotas para exclusão */
router.delete("/funcionario", function(req, res, next){

});

router.delete("/empresa", function(req, res, next){

});

router.delete("/pergunta", function(req, res, next){

});

module.exports = router;
