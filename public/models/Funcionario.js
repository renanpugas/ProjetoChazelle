class Funcionario{

    constructor(){}
    
    static checkLogin(db, email, senha){

        return new Promise((resolve, reject) =>{

            let results = db.database().collection("Funcionarios")
                .where("email_funcionario", "==", email).where("senha_funcionario", "==", senha);

                console.log(results);
            
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

                console.log(results);
            
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

            db.database().collection("Funcionarios").doc(data.CPF_funcionario).set(data)
            .then(result =>{
                resolve("Dados adicionados");
            })
            .catch(error =>{
                reject(error);
            })
        });

    }

    update(db, cpf, data){

        return new Promise((resolve, reject)=>{

            db.database().collection("Funcionarios").doc(cpf).update(data)
                .then(() =>{
                    resolve("Dados atualizados com sucesso");
                })
                .catch(error =>{
                    reject(error);
                })

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
    
}

module.exports = Funcionario;