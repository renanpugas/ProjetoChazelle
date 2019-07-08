var firebase = require("firebase");
require("firebase/firestore");
var keyFirestore = require("./../keys/firebase.js");

class Firestore {
	
	constructor(){
	
		//verifica se o firebase já foi iniciado
		//if(!window._initializedFirebase) {

			//inicializa o firebase
			firebase.initializeApp(keyFirestore);

			//window._initializedFirebase = true;
		//}
		
	}
	
	database(){
	
		return firebase.firestore();
	
	}
}

module.exports = Firestore;