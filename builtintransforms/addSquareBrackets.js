'use strict'
module.exports = function(value, intentName, slotName){
	if(typeof value != "undefined" && value != null){
		let returnValue = "[" + value + "]";
		return returnValue;
	}
	return;
};
