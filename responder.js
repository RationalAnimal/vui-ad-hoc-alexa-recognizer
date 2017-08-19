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

let responder = {};
/*
responder.combineRules = [
  {
    "name": "setTo",
    "description": "Use this response as a full response, completely replacing anything that was there or setting it to this new value if there was no prior response"
  },
  {
    "name": "mergeReplace",
    "description": "Replace the fields in the combined result using the fields from the new one, but leave other values in place"
  },
  {
    "name": "mergeAppend",
    "description": "Append/combine values where they exist, add where they don't.  Append/combine does NOT change the type to an array if it wasn't already an array. So, strings get appended, numbers get added, arrays get concatenated, some strings (e.g. ssml) may have some processing instead of plain concatenation."
  }
];
*/
let _produceResult = function(matchedIntent, stateAccessor, applicationState, responderSpec){
  if(typeof responderSpec === "undefined" || responderSpec === null){
    return;
  }
  if(typeof responderSpec.functionSource === "string"){
    let scratchFunc = new Function('scratchFunc', responderSpec.functionSource);
    let result = scratchFunc(matchedIntent, stateAccessor, applicationState);
    return result;
  }
  else if(typeof responderSpec.directValue !== "undefined"){
    return responderSpec.directValue;
  }
  else if(typeof responderSpec.directValues !== "undefined"){
    let directValues = responderSpec.directValues;
    if(directValues.pickMethod === "random"){
//      console.log("_produceResult, random");
      if(typeof directValues.values !== "undefined" && Array.isArray(directValues.values)){
        let randomIndex = Math.floor(Math.random() * directValues.values.length);
        return directValues.values[randomIndex];
      }
    }
    else if(directValues.pickMethod === "randomDoNotRepeat"){
//      console.log("_produceResult, randomDoNotRepeat");
      if(typeof directValues.values !== "undefined" && Array.isArray(directValues.values) &&
         typeof directValues.repeatSelector !== "undefined" && directValues.repeatSelector !== null){
        let usedValues = stateAccessor.getState(applicationState, directValues.repeatSelector);
//        console.log("usedValues: ", JSON.stringify(usedValues));
        if(typeof usedValues === "undefined" || Array.isArray(usedValues) !== true){
          usedValues = [];
//          console.log("setting usedValues to empty array: ", JSON.stringify(usedValues));
        }
        let unusedValues = [];
        let stringifiedUsedValues = [];
        for(let i = 0; i < usedValues.length; i ++){
          stringifiedUsedValues.push(JSON.stringify(usedValues[i]));
        }
        for(let i = 0; i < directValues.values.length; i++){
          if(stringifiedUsedValues.indexOf(JSON.stringify(directValues.values[i])) < 0){
//            console.log("adding to unusedValues: ", JSON.stringify(directValues.values[i]));
            unusedValues.push(directValues.values[i]);
          }
        }
        if(unusedValues.length === 0){
          // This means all the values have been used - reset
          unusedValues = unusedValues.concat(directValues.values);
          usedValues = [];
        }
//        console.log("unusedValues: ", JSON.stringify(unusedValues));
        let randomIndex = Math.floor(Math.random() * unusedValues.length);
        let returnValue = unusedValues[randomIndex];
        if(typeof returnValue !== "undefined" && returnValue !== null){
          usedValues.push(returnValue);
          stateAccessor.setState(applicationState, directValues.repeatSelector, usedValues);
        }
        return returnValue;
      }
    }
  }

};

let _combineResponses = function(response1, response2){
  // TODO finish
  if(typeof response2 === "undefined" || response2 === null){
    return response2;
  }
  let combineRule = response2.combineRule;
  if(typeof combineRule === "undefined" || combineRule === null){
    combineRule = "mergeReplace";
  }
  switch(combineRule){
    case "mergeReplace":
      let returnValue = JSON.parse(JSON.stringify(response1));
      for (var property in response2) {
        if (response2.hasOwnProperty(property)) {
          returnValue[property] = response2[property];
        }
      }
      return returnValue;
      break;
    case "setTo":
    default:
      return response2;
      break;
  }
};

responder.produceResult = _produceResult;
responder.combineResponses = _combineResponses;

module.exports = responder;
