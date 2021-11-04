const fs = require('fs');
const moment=require('moment');
var busy;
var busyDay=new Array();
var busyDays=new Map();
var result;

function contenuFichier(nom){
	var text = fs.readFileSync('../data/'+nom,'utf8')
	var textTable=text.split('\r\n')
	return textTable;
}


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
	console.log(busyDays)
	return busyDays;
}


function heureDispo(busyDays,day){
	for (i=8;i<18;i++){
		for(j=0;j<60;j++){
			var reuInit=i.toString()+":"+j.toString();
			var reuInitHr=moment(reuInit,'HH:mm');
			var reuFinHr=reuInitHr.clone();
			reuFinHr=reuFinHr.add(59,'minutes');
			for(let k=0;k<busyDays.get(day).length;k++){
				console.error(reuFinHr);
				console.error(busyDays.get(day)[k][0]);
				console.error(busyDays.get(day)[k][1]);
				console.error(reuFinHr.isBetween(busyDays.get(day)[k][0],busyDays.get(day)[k][1],'hour'));
				if(!(reuInitHr.isBetween(busyDays.get(day)[k][0],busyDays.get(day)[k][1]))){
					if(!(reuFinHr.isBetween(busyDays.get(day)[k][0],busyDays.get(day)[k][1]))){
						return [reuInitHr,reuFinHr];
						break;
					}
				}
			}
		}
		
	}
	return "pas de créneaux disponibles";
}
console.log("result: "+heureDispo(triParJour(contenuFichier("input1.txt")),1))






