class Pergunta{

    construct(database){}

    getEmpresa(){}
    
    static getAllPerguntas(db, cnpj){

        return new Promise((resolve, reject) =>{

            db.database().collection("Empresas").doc(cnpj).collection("Perguntas").get().then(function(querySnapshot) {
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

    getPergunta(db, id){

        return new Promise((resolve, reject) =>{

            db.database().collection("Perguntas").doc(id).get().then(doc =>{

                if (doc.exists) {
                    resolve(doc.data());
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
            
            db.database().collection("Perguntas").add(data)
            .then(result =>{
                resolve("Dados adicionados");
            })
            .catch(error =>{
                reject(error);
            })
        });

    }

    update(db, id, data){

        return new Promise((resolve, reject)=>{

            db.database().collection("Perguntas").doc(id).update(data)
                .then(results =>{
                    resolve("Dados atualizados com sucesso");
                })
                .catch(err =>{
                    reject(err);
                })

        });

    }

    delete(db, id){

        return new Promise((resolve, reject)=>{

            db.database().collection("Perguntas").doc(id).delete()
                .then(results =>{
                    resolve("Dados deletados com sucesso");
                })
                .catch(err =>{
                    reject(error);
                })

        });

    }

}

module.exports = Pergunta;