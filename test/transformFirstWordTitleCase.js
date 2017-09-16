'use strict'
module.exports = function(value, intentName, slotName){
	if(typeof value != "undefined" && value != null){
		let returnValue = value.toLowerCase();
		returnValue = returnValue.slice(0, 1).toUpperCase() + returnValue.slice(1);
		return returnValue;
	}
	return;
};
