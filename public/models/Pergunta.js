class Pergunta{

    construct(database){}

    getEmpresa(){}
    static getAllPerguntas(database, nameEmpresa){}

    static save(db, data){

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

module.exports = Pergunta;