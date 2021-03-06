class Empresa{

    constructor(database){}

    //Busca uma determinada empresa no banco de dados
    //Recebe como parametro o CNPJ da empresa a ser buscada
    getEmpresa(db, cnpj){

        return new Promise((resolve, reject) =>{

            let results = db.database().collection("Empresas")
                .where("CNPJ_empresa", "==", cnpj);

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

    getEmpresaByName(db, nome){

      return new Promise((resolve, reject) =>{

          let results = db.database().collection("Empresas")
              .where("nome_empresa", "==", nome);

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

    static getAllEmpresas(db){

        return new Promise((resolve, reject) =>{

            db.database().collection("Empresas").get().then(function(querySnapshot) {
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
            
            db.database().collection("Empresas").doc(data.CNPJ_empresa).set(data)
            .then(result =>{
                resolve("Dados adicionados");
            })
            .catch(error =>{
                reject(error);
            })
        });

    }

    update(db, cnpj, data){

        return new Promise((resolve, reject)=>{

            db.database().collection("Empresas").doc(cnpj).update(data)
                .then(() =>{
                    resolve("Dados atualizados com sucesso");
                })
                .catch(error =>{
                    reject(error);
                })

        });

    }

    delete(db, cnpj){

      return new Promise((resolve, reject)=>{

          db.database().collection("Empresas").doc(cnpj).get().then((docSnapshot) => {
              if (docSnapshot.exists) {

              db.database().collection("Empresas").doc(cnpj).delete()
                  .then(() =>{
                      resolve("Dados excluidos com sucesso");
                  })
                  .catch(error =>{
                      console.log(error);
                      reject(error);
                  });

              } else {
                  console.log("Documento não encontrado");
                  reject("Documento não encontrado");

              } 

          });

      });

  }


}

module.exports = Empresa;