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

    static getAllFunctionarios(database, CNPJEmpresa){}

    save(db, data){

        return new Promise((resolve, reject)=>{

            db.database().collection("Funcionarios").add(data)
            .then(result =>{
                resolve("Dados adicionados");
            })
            .catch(error =>{
                reject(error);
            })
        });

    }

    update(){}
    delete(){}

}

module.exports = Funcionario;