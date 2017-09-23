'use strict'
/**
 * Format a 10 digit phone number like this:
 * 111 111 1111
 * @param value - the phone number to format
 * @param intentName - the intent name, ignored here since this is a built in transform function.
 * @param slotName - the slot name, ignored here since this is a built in transform function.
 * @param slotType - slot type, verified to be TRANSCEND.US_PHONE_NUMBER. If not - returns the passed in value.
 * @returns {*} either formatted value, unchanged value (if not US_PHONE_NUMBER slot type) or undefined if the input is
 * undefined or null
 */
module.exports = function(value, intentName, slotName, slotType){
	if(slotType !== "TRANSCEND.US_PHONE_NUMBER"){
		return value;
	}
	if(typeof value !== "undefined" && value !== null){
		let returnValue = "";
		returnValue += value.substring(0,3);
		returnValue += " ";
    returnValue += value.substring(3, 6);
    returnValue += " ";
    returnValue += value.substring(6);
		return returnValue;
	}
	return;
};
