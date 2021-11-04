const fs = require('fs');
var busy;
var busyDay=new Array();
var busyDays=new Map();
var result;


function contenuFichier(nom){
	var text = fs.readFileSync('../data/'+nom,'utf8')
	var textTable=text.split('\r\n')
	return textTable;
}

console.log(busy)

function triParJour(busy){
	for (let i=1;i<6;i++){
		for (let j=0;j<busy.length;j++){
			if(busy[j][0]==i){
				var plageInit=busy[j].slice(2,7);
				var plageFin=busy[j].slice(8,13);
				plageInitHr=parseInt(plageInit.slice(0,2));
				plageFinHr=parseInt(plageFin.slice(0,2));
				while(plageInitHr<=plageFinHr){
					if(!busyDay.includes(plageInitHr)){
						busyDay.push(plageInitHr);
					}
					plageInitHr++
				}
			}
		}
		busyDays.set(i,busyDay);
		busyDay=[]
	}
	return busyDays;
}

function heureDispo(busyDays){
	console.log(busyDays)
	for (let i=1;i<6;i++){
		console.log(busyDays.get(i))
		for(let j=8;j<18;j++){
			if(!(busyDays.get(i).includes(j))){
				return i.toString()+" "+j.toString()+":00-"+j.toString()+":59";
				break;
			}
		}
	}
	return "pas de créneaux disponibles";
}


console.log(heureDispo(triParJour(contenuFichier('input5.txt'))))



