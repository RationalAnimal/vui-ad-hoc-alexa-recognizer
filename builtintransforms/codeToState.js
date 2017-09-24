/*
 @author Ilya Shubentsov

 MIT License

 Copyright (c) 2017 Ilya Shubentsov

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
'use strict'
let states = require("../builtinslottypes/usstates.json");
let _getFullStateObject = function(postalCode){
	for(let i = 0; i < states.values.length; i++){
		if(states.values[i].postalCode.toLowerCase() === postalCode.toLowerCase()){
			return states.values[i];
		}
	}
};
/**
 * Changes the passed in state's postal code to the corresponding name.  Only works for states and NOT territories.
 * @param value - state's name
 * @param intentName - the intent name, ignored here since this is a built in transform function.
 * @param slotName - the slot name, ignored here since this is a built in transform function.
 * @param slotType - slot type, verified to be TRANSCEND.US_STATE. If not - returns the passed in value.
 * @returns {*} either state's name, unchanged value (if not US_STATE slot type or not a state) or undefined if
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
		if(fullState.isState === true && typeof fullState.name !== "undefined"){
			return fullState.name;
		}
		else {
			return fullState.postalCode;
		}
	}
	//return;
};
