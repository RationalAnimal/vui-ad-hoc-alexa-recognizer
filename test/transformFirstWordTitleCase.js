'use strict'
module.exports = function(value, intentName, slotName){
	if(typeof value != "undefined" && value != null){
		let returnValue = value.toLowerCase();
		returnValue = value.slice(0, 1).toUpperCase() + value.slice(1);
		return returnValue;
	}
	return;
};
