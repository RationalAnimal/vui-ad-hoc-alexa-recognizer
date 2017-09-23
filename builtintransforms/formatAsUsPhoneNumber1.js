'use strict'
module.exports = function(value, intentName, slotName, slotType){
	if(slotType !== "TRANSCEND.US_PHONE_NUMBER"){
		return value;
	}
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
