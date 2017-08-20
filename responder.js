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

let _combineResponses = function(response1, response2, combineRule){
//  console.log("_combineResponses, 1, response2: ", JSON.stringify(response2, null, 2));
  if(typeof response2 === "undefined" || response2 === null){
//    console.log("_combineResponses, 2");
    return response2;
  }
//  console.log("_combineResponses, 3, combineRule: " + combineRule);
  if(typeof combineRule === "undefined" || combineRule === null){
//    console.log("_combineResponses, 4");
    combineRule = "mergeReplace";
  }
  let returnValue;
  switch(combineRule){
    case "mergeReplace":
//      console.log("_combineResponses, 5");
      returnValue = JSON.parse(JSON.stringify(response1));
      for (var property in response2) {
        if (response2.hasOwnProperty(property)) {
          returnValue[property] = response2[property];
        }
      }
      return returnValue;
      break;
    case "mergeAppend":
//      console.log("_combineResponses, 6");
      returnValue = JSON.parse(JSON.stringify(response1));
//      console.log("_combineResponses, 6.1");
      for (var property in response2) {
        if (response2.hasOwnProperty(property)) {
          let existingValue = response1[property];
          let newValue = response2[property];
          if(typeof existingValue === "undefined" || existingValue === null){
            returnValue[property] = response2[property];
          }
          else if(typeof newValue === "undefined" || newValue === null){
            delete returnValue[property];
          }
          else if(typeof existingValue === "string"){
            if(property === "text"){
              returnValue[property] = existingValue + "  " + response2[property];
            }
            else if(property === "ssml"){
              if(/<\/speak>\s*$/ig.test(existingValue) && /^\s*<speak>/ig.test(newValue.toString())){
                // Strip "inner" speak tags, and concatenate.
                try{
                  returnValue[property] = /(.*)(?:<\/speak>\s*$)/ig.exec(existingValue)[1] + "  " + /(?:^\s*<speak>)(.*)/ig.exec(newValue.toString())[1];
                }
                catch(e){
                  returnValue[property] = existingValue + "  " + newValue.toString();
                }
              }
            }
            else {
              // Catch all string concatenation
              returnValue[property] = existingValue + newValue.toString();
            }
          }
          else if(Array.isArray(existingValue)){
            if(Array.isArray(newValue)){
              // concatenate arrays
              returnValue[property] = existingValue.concat(newValue);
            }
            else {
              // add to an array
              returnValue[property] = existingValue.concat([newValue]);
            }
          }
          else if(typeof existingValue === "object" && typeof newValue === "object"){
            if(property === "card"){
              try{
                delete returnValue["card"];
              }
              catch(e){
                // ignore
              }
              returnValue["cards"] = {existingValue, newValue};
            }
            else {
              returnValue[property] = {existingValue, newValue};
            }
          }
          else {
            try{
              returnValue[property] = existingValue + newValue;
            }
            catch(e){
              returnValue[property] = existingValue.toString() + newValue.toString();
            }
          }
        }
      }
      return returnValue;

      break;
    case "setTo":
//      console.log("_combineResponses, 7");
    default:
//      console.log("_combineResponses, 8");
      return response2;
      break;
  }
};

responder.produceResult = _produceResult;
responder.combineResponses = _combineResponses;

module.exports = responder;
