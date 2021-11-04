//Le module fs nous permet de manipuler les fichiers 
const fs = require('fs');
//le module moment nous permet de manipuler les moment()
const moment=require('moment');
const path=require('path');

var busyDay=new Array();
var busyDays=new Map();
var result;


//Cette Fonction récupére le contenu des fichiers contenant les plages horaire occupés 
function contenuFichier(nom){
	var text = fs.readFileSync(path.resolve(__dirname,'../data/'+nom),'utf8');
	var textTable=text.split('\r\n');
	return textTable;
}

//Cette fonction prend en parametre toutes les plages horaires et 
//nous permet de renvoyer une MAP dont les keys sont les jours(1:5) 
//et le contenu sont les listes de plages horaires occupées
function triParJour(busy){
	for (let i=1;i<6;i++){
		for (let j=0;j<busy.length;j++){
			if(busy[j][0]==i){
				var plageInit=moment(busy[j].slice(2,7),'HH:mm');
				var plageFin=moment(busy[j].slice(8,13),'HH:mm');
				busyDay.push([plageInit,plageFin]);
			}
		}
		busyDays.set(i,busyDay);
		busyDay=[]
	}
	//console.log(busyDays)
	return busyDays;
}

//Cette fonction prend en parametre une MAP des jours et des plages horaires occupées correspondantes
//ainsi que le jour que l'on souhaite observer 
//elle va ensuite retourner la premiere plage horaire qui convient à tout le monde sur le jour concerne 
function heureDispoJour(busyDays,day){
	var possible=false;
	//on crée deux boucles : une pour les heures et une pour les minutes 
	for (i=8;i<17;i++){
		for(j=0;j<60;j++){
			var reuInit=i.toString()+":"+j.toString();
			var reuInitHr=moment(reuInit,'HH:mm');
			var reuFinHr=reuInitHr.clone();
			//console.log("heure début réu : ");
			//console.log(reuInitHr);
			reuFinHr=reuFinHr.add(59,'minutes');
			//console.log("heure fin réu : ");
			//console.log(reuFinHr);
			for(let k=0;k<busyDays.get(day).length;k++){
				//console.log("créneau : "+k.toString()+(" : "))
				//console.log(busyDays.get(day)[k][0]);
				//console.log(busyDays.get(day)[k][1]);
				//console.log("heure debut comprise ? ")
				//console.log(reuInitHr.isBetween(busyDays.get(day)[k][0],busyDays.get(day)[k][1],[]));
				//console.log("heure fin comprise ? ")
				//console.log(reuFinHr.isBetween(busyDays.get(day)[k][0],busyDays.get(day)[k][1],[]));
				//Ici on test si les deux heures de la plages horaires sont comprise dans chacuns des créneaux du jour
				if(!(reuInitHr.isBetween(busyDays.get(day)[k][0],busyDays.get(day)[k][1],[]))){
					if(!(reuFinHr.isBetween(busyDays.get(day)[k][0],busyDays.get(day)[k][1],[]))){
						if(reuInitHr.isSame(busyDays.get(day)[k][0]) || reuFinHr.isSame(busyDays.get(day)[k][0]) || reuFinHr.isSame(busyDays.get(day)[k][1]) || reuInitHr.isSame(busyDays.get(day)[k][1])){
							possible=false;
							break;
						}
						else{
							possible=true;
						}
					}
					else{
						possible=false;
						break;
					}
				}
				else{
					possible=false;
					break;
				}
			}
			if(possible==true){
				//Si elle n'est comprise dans aucun on sort de toutes les boucles et on retourne la plage horaire 
				return [reuInitHr,reuFinHr];
				break;
				break;
				break;
			}
		}
		
	}
	//Si on arrive à ce point la, il n'y a aucun créneau disponible pour tout le monde 
	return "pas de créneaux disponibles";
}

//Pour finir on crée une boucle sur les jours qui va appeler les 3 fonctions crées ci dessus 
function main(fichier){
	for(let y=1;y<6;y++){
	//console.log("jour : "+y.toString());
	// Si on veut tester d'autres input il faut changer "input1.txt"
	var reu=heureDispoJour(triParJour(contenuFichier(fichier)),y);
	if(reu!="pas de créneaux disponibles"){
		return y.toString()+" "+reu[0].format('HH:mm')+'-'+reu[1].format('HH:mm');
		break;
	}
}
}



describe('Suite de test 1 : ', () => {
	for (let i=1;i<6;i++){
		test('test '+i.toString(), () => {
			var text = fs.readFileSync(path.resolve(__dirname,'../data/output'+i.toString()+'.txt'),'utf8');
			console.log(text)
			const result= main('input'+i.toString()+'.txt');
    		expect(result).toBe(text)
  		})
	}
  
})