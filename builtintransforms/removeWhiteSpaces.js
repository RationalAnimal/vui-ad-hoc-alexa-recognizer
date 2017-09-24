'use strict'
/**
 * Removes all continuous sequences of any white space characters from the provided.
 * @param value - in which to perform removal
 * @param intentName - the intent name, ignored here since this is a built in transform function.
 * @param slotName - the slot name, ignored here since this is a built in transform function.
 * @param slotType - the slot type, ignored here since this is a built in transform function.
 * @returns {*} either either the value with all the white spaces removed or undefined if
 * the input is undefined or null
 */
module.exports = function(value, intentName, slotName, slotType){
	if(typeof value !== "undefined" && value !== null){
		let returnValue = value.replace(/\s+/g, '');
		return returnValue;
	}
	return value;
};
