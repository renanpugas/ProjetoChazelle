const replace = require('replace-in-file');
var rivescript = require("rivescript");
var fs = require("fs");

class Rive {

    static insert(pergunta, resposta, CNPJ){
        return new Promise((resolve, reject)=>{

            console.log("arquivo rive afasfksfosfjaiofsajsfiojsfioasfjiasf", pergunta, resposta, CNPJ);

            let riveString = `\n+${pergunta}\r\n-${resposta}`;
            fs.appendFile(`rive_files/${CNPJ}.rive`, riveString, err =>{

                console.log(err);
                if(err) reject(err);
                
                resolve("Dados adicionados com sucesso!");

            });
        });
    }

    static update(perguntaOriginal, respostaOriginal, perguntaNova, respostaNova, CNPJ){

        return new Promise((resolve, reject)=>{

            var pergunta = perguntaOriginal;
            var resposta = respostaOriginal;
            
            var regex = new RegExp("\\+" + pergunta + "\\r\\n\\-" + resposta, "g");
            console.log(regex);

            let options1 = {
                files: `rive_files/${CNPJ}.rive`,
                from: regex,
                to: `+${perguntaNova}\r\n-${respostaNova}`,
            };

            replace(options1).then(results => {

                //const changedFiles = results.filter(result => result.hasChanged).map(result => result.file);

                let fileHasChanged = JSON.stringify(results);
                fileHasChanged.includes(`"hasChanged":false`) ? console.log("false") : console.log("true");

                let ola = JSON.stringify(results).replace("[", "").replace("]", "").replace(`"f`, "f").replace(`e"`, "e").replace(`"h`, "h").replace(`d"`, "d").replace("{", "").replace("}", "");
                //console.log(fileHasChanged);

                resolve();                
            })
            .catch(error => {
                reject(error);
            });

        });

    }

    static delete(perguntaDB, respostaDB, CNPJ){

        return new Promise((resolve, reject)=>{

            console.log("delete rive", perguntaDB, respostaDB, CNPJ);
            var pergunta = perguntaDB;
            var resposta = respostaDB;
            
            var regex = new RegExp("\\+" + perguntaDB + "\\r\\n\\-" + respostaDB, "g");

            let options1 = {
                files: `rive_files/${CNPJ}.rive`,
                from: regex,
                to: "",
            };

            replace(options1).then(results => {

                //const changedFiles = results.filter(result => result.hasChanged).map(result => result.file);

                let fileHasChanged = JSON.stringify(results);
                fileHasChanged.includes(`"hasChanged":false`) ? console.log("false") : console.log("true");

                let ola = JSON.stringify(results).replace("[", "").replace("]", "").replace(`"f`, "f").replace(`e"`, "e").replace(`"h`, "h").replace(`d"`, "d").replace("{", "").replace("}", "");
                //console.log(fileHasChanged);

                resolve(results);                
            })
            .catch(error => {
                reject();
            });

        });

    }

}

// // Rive.insert("teste", "troca de texto","84848748484").then(()=>{

// // }).catch(()=>{

// // });

// Rive.update("teste", "troca de texto", "teste", "para trocar texto", "84848748484")
// .then(()=>{
//     console.log(results);
// }).catch((err)=>{
//     console.log(err);
// });

module.exports = Rive;