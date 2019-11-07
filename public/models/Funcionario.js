const validator = require("validator");

class Funcionario{
    
    static checkLogin(db, email, senha){

        return new Promise((resolve, reject) =>{

            let results = db.database().collection("Funcionarios")
                .where("email_funcionario", "==", email).where("senha_funcionario", "==", senha);

                //console.log(results);
            
                results.get().then(function(querySnapshot) {
                    if (querySnapshot.size > 0) {
                      // Contents of first document
                      resolve(querySnapshot.docs[0].data());
                    } else {
                      reject("Nenhum usuário encontrado");
                    }
                  })
                  .catch(function(error) {
                    reject("Error getting document: ", error);
                  });


        });

    }

    getFuncionario(db, cpf){

        return new Promise((resolve, reject) =>{

            let results = db.database().collection("Funcionarios")
                .where("CPF_funcionario", "==", cpf);

                //console.log(results);
            
                results.get().then(function(querySnapshot) {
                    if (querySnapshot.size > 0) {
                      // Contents of first document
                      resolve(querySnapshot.docs[0].data());
                    } else {
                      reject("No such document!");
                    }
                  })
                  .catch(function(error) {
                    reject("Error getting document: ", error);
                  });

        });

    }

    static getAllFunctionarios(db, cnpj){

        return new Promise((resolve, reject) =>{

                db.database().collection("Funcionarios").where("CNPJ_empresa", "==", cnpj).get().then(function(querySnapshot) {
                    if (querySnapshot.size > 0) {
                      // Contents of first document
                      resolve(querySnapshot.docs);
                    } else {
                      reject("No such document!");
                    }
                  })
                  .catch(function(error) {
                    reject("Error getting document: ", error);
                  });


        });

    }

    save(db, data){

        return new Promise((resolve, reject)=>{

            let dataValidated = undefined;

            //Validando dados
            if(!validator.isEmail(data.email_funcionario)){ 
                dataValidated = false;
                reject("Email inválido!");
                return;
            } else if(data.senha_funcionario.length < 6){ 
                dataValidated = false;
                reject("A senha deve conter no mínimo 6 caracteres");
                return;
            } else if(data.nome_funcionario < 2){ 
              dataValidated = false;
              reject("O nome deve conter no mínimo 2 caracteres");
              return;
            } else if(dataValidated === undefined) {
                this.getFuncionario(db, data.CPF_funcionario).then(()=>{
                    dataValidated = false;
                    reject("CPF já cadastrado");
                    return;
                }).catch(()=>{
                    db.database().collection("Funcionarios").doc(data.CPF_funcionario).set(data)
                    .then(result =>{
                        console.log(result);
                        resolve("Dados adicionados");
                    })
                    .catch(error =>{
                        console.log(error);
                        reject(error);
                    });
                });
            }
               
        });

    }

    update(db, cpf, data){

        return new Promise((resolve, reject)=>{

          if(!validator.isEmail(data.email_funcionario)){
              reject("Email inválido");
              return;
          } else if(data.nome_funcionario.length < 2){
            reject("O nome deve conter no mínimo 2 caracteres");
            return;
          } else {
            let results = db.database().collection("Funcionarios").where("email_funcionario", "==", data.email_funcionario);
            results.get().then((querySnapshot)=>{
            if (querySnapshot.size > 0) {

              if(querySnapshot.docs[0].data().CPF_funcionario == cpf){
                db.database().collection("Funcionarios").doc(cpf).update(data)
                .then(() =>{
                    resolve("Dados atualizados com sucesso");
                })
                .catch(error =>{
                    reject(error);
                });
              } else {
                reject("Email já cadastrado");
              }
            } else {
              db.database().collection("Funcionarios").doc(cpf).update(data)
                .then(() =>{
                    resolve("Dados atualizados com sucesso");
                })
                .catch(error =>{
                    console.log(error);
                    reject("Erro na atualização de dados");
                });
            }
            }).catch((error)=> {
              console.log(error);
              reject("Erro na atualização de dados");
            });
          }
        });

    }

    delete(db, cpf){

        return new Promise((resolve, reject)=>{

            db.database().collection("Funcionarios").doc(cpf).get().then((docSnapshot) => {
                if (docSnapshot.exists) {

                db.database().collection("Funcionarios").doc(cpf).delete()
                    .then(() =>{
                        resolve("Dados excluidos com sucesso");
                    })
                    .catch(error =>{
                        reject(error);
                    });

                } else {

                    reject("Documento não encontrado");

                } 

            });

        });

    }

    updateSenha(db, senhaAntiga, senhaNova, userCPF){

        return new Promise((resolve, reject)=>{

            if(senhaNova.length < 6){ 
                reject("A senha deve conter no mínimo 6 caracteres");
                return;
            } else {

                let results = db.database().collection("Funcionarios")
                .where("senha_funcionario", "==", senhaAntiga)
                .where("CPF_funcionario", "==", userCPF);

                //console.log(results);
            
                results.get().then((querySnapshot)=> {
                    if (querySnapshot.size > 0) {
                      // Contents of first document
                      this.update(db, userCPF, { senha_funcionario: senhaNova }).then(()=>{
                        resolve();
                      }).catch((error)=>{
                        reject("Erro");
                      });
                    } else {
                      reject("Senha antiga incorreta!");
                    }
                  })
                  .catch((error)=> {
                    reject("Erro");
                  });

            }

        });

    };
    
}

module.exports = Funcionario;