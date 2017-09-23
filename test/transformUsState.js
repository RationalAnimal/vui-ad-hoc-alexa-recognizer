'use strict'
var states = require("../builtinslottypes/usstates.json");
var _getFullStateObject = function(name){
	for(let i = 0; i < states.values.length; i++){
		if(states.values[i].name.toLowerCase() == name.toLowerCase()){
			return states.values[i];//.postalCode;
		}
	}
};
module.exports = function(value, intentName, slotName, slotType){
	if(typeof value != "undefined" && value != null){
		let fullState = _getFullStateObject(value);
		if(fullState.isState == true && typeof fullState.postalCode != "undefined"){
			return fullState.postalCode;
		}
		else {
			return fullState.name;
		}
	}
	return;
};
