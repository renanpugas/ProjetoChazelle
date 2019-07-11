class Funcionario{

    constructor(){}

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

    static getAllFunctionarios(db){

        return new Promise((resolve, reject) =>{

                db.database().collection("Funcionarios").get().then(function(querySnapshot) {
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

            db.database().collection("Funcionarios").doc(cpf).delete()
                .then(() =>{
                    resolve("Dados excluidos com sucesso");
                })
                .catch(error =>{
                    reject(error);
                })

        });

    }

}

module.exports = Funcionario;