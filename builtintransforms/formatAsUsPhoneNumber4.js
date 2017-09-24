
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
/**
 * Format a 10 digit phone number like this:
 * 111-111-1111
 * @param value - the phone number to format
 * @param intentName - the intent name, ignored here since this is a built in transform function.
 * @param slotName - the slot name, ignored here since this is a built in transform function.
 * @param slotType - slot type, verified to be TRANSCEND.US_PHONE_NUMBER. If not - returns the passed in value.
 * @returns {*} - either formatted value, unchanged value (if not US_PHONE_NUMBER slot type) or undefined if the input is
 * undefined or null
 */
module.exports = function(value, intentName, slotName, slotType){
	if(slotType !== "TRANSCEND.US_PHONE_NUMBER"){
		return value;
	}
	if(typeof value !== "undefined" && value !== null){
		let returnValue = "";
		returnValue += value.substring(0,3);
		returnValue += "-";
    returnValue += value.substring(3, 6);
    returnValue += "-";
    returnValue += value.substring(6);
		return returnValue;
	}
	//return;
};
