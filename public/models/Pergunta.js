class Pergunta{

    construct(database){}

    getEmpresa(){}
    
    static getAllPerguntas(db, cnpj){

        return new Promise((resolve, reject) =>{

            db.database().collection("Perguntas").where("CNPJ_pergunta", "==", cnpj).get().then(function(querySnapshot) {
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
                resolve(result);
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

            db.database().collection("Perguntas").doc(id).get().then((docSnapshot) => {
                if (docSnapshot.exists) {

                db.database().collection("Perguntas").doc(id).delete()
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

    addLike(db, resposta){

        return new Promise((resolve, reject)=>{

            db.database().collection("Perguntas").where("resposta_pergunta", "==", resposta).get().then((querySnapshot)=> {
                if (querySnapshot.size > 0) {

                    let questao = querySnapshot.docs[0].id;
                    let numLikes = querySnapshot.docs[0].data().likes_pergunta;
                    numLikes++;

                    db.database().collection("Perguntas").doc(questao).update({likes_pergunta: numLikes})
                    .then(results =>{
                        resolve("Dados atualizados com sucesso");
                    })
                    .catch(err =>{
                        reject(err);
                    });

                } else {
                  reject("No such document!");
                }

              })
              .catch(function(error) {
                reject("Error getting document: ", error);
              });

        });

    }

    addDislike(db, resposta){

        return new Promise((resolve, reject)=>{

            db.database().collection("Perguntas").where("resposta_pergunta", "==", resposta).get().then((querySnapshot)=> {
                if (querySnapshot.size > 0) {

                    let questao = querySnapshot.docs[0].id;
                    let numDislikes = querySnapshot.docs[0].data().dislikes_pergunta;
                    numDislikes++;

                    db.database().collection("Perguntas").doc(questao).update({dislikes_pergunta: numDislikes})
                    .then(results =>{
                        resolve("Dados atualizados com sucesso");
                    })
                    .catch(err =>{
                        reject(err);
                    });

                } else {
                  reject("No such document!");
                }

              })
              .catch(function(error) {
                reject("Error getting document: ", error);
              });

        });

    }

}

module.exports = Pergunta;