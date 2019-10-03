const replace = require('replace-in-file');
var rivescript = require("rivescript");
var fs = require("fs");

class Rive {

    insert(pergunta, resposta, CNPJ){
        return new Promise((resolve, reject)=>{
            let riveString = `\n+${pergunta}\r\n-${resposta}`;
            fs.appendFile(`../../rive_files/84848748484.rive`, riveString, err =>{

                if(err) reject(err);
                
                resolve("Dados adicionados com sucesso!");

            });
        });
    }

    delete(pergunta, enunciado, CNPJ){
        var teste1 = pergunta;
        var teste2 = enunciado;
        console.log("teste1" + teste1);
        
        var regex = new RegExp("\\+" + teste1 + "\\r\\n\\-" + teste2, "g");

        console.log(regex);

        let options1 = {
            files: `../../rive_files/${CNPJ}.rive`,
            from: regex,
            to: "",
        };

        console.log(regex);

        replace(options1).then(results => {

            //const changedFiles = results.filter(result => result.hasChanged).map(result => result.file);

            let fileHasChanged = JSON.stringify(results);
            fileHasChanged.includes(`"hasChanged":false`) ? console.log("false") : console.log("true");

            let ola = JSON.stringify(results).replace("[", "").replace("]", "").replace(`"f`, "f").replace(`e"`, "e").replace(`"h`, "h").replace(`d"`, "d").replace("{", "").replace("}", "");
            console.log(fileHasChanged);

            console.log("results");
            //res.send(results);
            
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });

    }


}

var data = fs.readFileSync('banlist.txt', 'utf-8');
var ip = new RegExp("\\+" + "gol", "g");


var newValue = data.replace(ip, '');
fs.writeFileSync('banlist.txt', newValue, 'utf-8');

// let riveString = `\n+oi\r\n-pao`;
// fs.appendFile(`../../rive_files/84848748484.rive`, riveString, err =>{

//     if(err) console.log(err);
    

// });

let riveClass = new Rive();
riveClass.insert("vamos coringao", "avelenda", "84848748484").then(()=>{
    console.log("ok");
}).catch((err)=>{
    console.log(err);
});


module.exports = Rive;