'use strict'
module.exports = function(value, intentName, slotName){
	if(typeof value != "undefined" && value != null){
		let returnValue = value.toLowerCase();
		return returnValue;
	}
	return;
};
