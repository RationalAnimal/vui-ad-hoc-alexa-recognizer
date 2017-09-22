'use strict'
module.exports = function(value, intentName, slotName){
	if(typeof value != "undefined" && value != null){
		let returnValue = "(";
		returnValue += value.substring(0,3);
		returnValue += ") ";
    returnValue += value.substring(3, 6);
    returnValue += "-";
    returnValue += value.substring(6);
		return returnValue;
	}
	return;
};
