'use strict'
module.exports = function(value, intentName, slotName, slotType){
	if(typeof value != "undefined" && value != null){
		let returnValue = value.toUpperCase();
		return returnValue;
	}
	return;
};
