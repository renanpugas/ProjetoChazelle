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

    save(db, cnpj, data){

        return new Promise((resolve, reject)=>{
            
            db.database().collection("Empresas").doc(cnpj).collection("Perguntas").add(data)
            .then(result =>{
                resolve("Dados adicionados");
            })
            .catch(error =>{
                reject(error);
            })
        });

    }

    update(db, cnpj, id){

        return new Promise((resolve, reject)=>{

            db.database().collection("Empresas").doc(cnpj).collection("Perguntas").doc(id).update(data)
                .then(results =>{
                    resolve("Dados atualizados com sucesso");
                })
                .catch(err =>{
                    reject(error);
                })

        });

    }

    delete(){

        return new Promise((resolve, reject)=>{

            db.database().collection("Empresas").doc(cnpj).collection("Perguntas").doc(id).delete()
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