'use strict'
let states = require("../builtinslottypes/usstates.json");
let _getFullStateObject = function(name){
	for(let i = 0; i < states.values.length; i++){
		if(states.values[i].name.toLowerCase() === name.toLowerCase()){
			return states.values[i];//.postalCode;
		}
	}
};
/**
 * Changes the passed in state's name to the corresponding postal code.  Only works for states and NOT territories.
 * @param value - state's name
 * @param intentName - the intent name, ignored here since this is a built in transform function.
 * @param slotName - the slot name, ignored here since this is a built in transform function.
 * @param slotType - slot type, verified to be TRANSCEND.US_STATE. If not - returns the passed in value.
 * @returns {*} either state's postal code, unchanged value (if not US_STATE slot type or not a state) or undefined if
 * the input is undefined or null
 */
module.exports = function(value, intentName, slotName, slotType){
	if(slotType !== "TRANSCEND.US_STATE"){
		return value;
	}
	if(typeof value !== "undefined" && value !== null){
		let fullState = _getFullStateObject(value);
		if (typeof fullState === "undefined" || fullState === null){
			return value;
		}
		if(fullState.isState === true && typeof fullState.postalCode !== "undefined"){
			return fullState.postalCode;
		}
		else {
			return fullState.name;
		}
	}
	//return;
};
