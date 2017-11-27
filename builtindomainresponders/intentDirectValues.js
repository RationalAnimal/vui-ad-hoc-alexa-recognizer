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
'use strict';

/**
 * This responder function will produce the direct value response based on intent name
 * @param match - recognizer match result
 * @param stateAccessor - state accessor to read the state (NOT used in this function)
 * @param selectorArray - selector of the substate (NOT used in this function)
 * @param args - arguments passed in from the domain configuration (or elsewhere).  Should look something like this:
 * {
 *   "directValues": {
 *     "intentName1": {
 *       "pickMethod": "random",
 *       "values": [
 *         "text": "blah1 a",
 *         "text": "blah1 b",
 *         "text": "blah1 c"
 *       ]
 *     },
 *     "intentName2": {
 *       "pickMethod": "random",
 *       "values": [
 *         "text": "blah2 a",
 *         "text": "blah2 b",
 *         "text": "blah2 c"
 *       ]
 *     }
 *   }
 * }
 * @returns object
 * @private
 */
let _responderFunction = function(match, stateAccessor, selectorArray, args){
  let intent = match.name;
  if(typeof args !== "undefined" && args !== null &&
     typeof args.directValues !== "undefined" && args.directValues !== null &&
     typeof args.directValues[intent] !== "undefined" && args.directValues[intent] !== null){

    let directValues = args.directValues[intent];
    if(directValues.pickMethod === "random"){
      if(typeof directValues.values !== "undefined" && Array.isArray(directValues.values)){
        let randomIndex = Math.floor(Math.random() * directValues.values.length);
        return directValues.values[randomIndex];
      }
    }


    else if(directValues.pickMethod === "randomDoNotRepeat"){
      if(typeof directValues.values !== "undefined" && Array.isArray(directValues.values) &&
        typeof directValues.repeatSelector !== "undefined" && directValues.repeatSelector !== null){

        let updatedStateSelectors = [].concat(selectorArray);
        updatedStateSelectors.push(directValues.repeatSelector);
        let usedValues = stateAccessor.getStateChain(updatedStateSelectors);
        if(typeof usedValues === "undefined" || Array.isArray(usedValues) !== true){
          usedValues = [];
        }
        let unusedValues = [];
        let stringifiedUsedValues = [];
        for(let i = 0; i < usedValues.length; i ++){
          stringifiedUsedValues.push(JSON.stringify(usedValues[i]));
        }
        for(let i = 0; i < directValues.values.length; i++){
          if(stringifiedUsedValues.indexOf(JSON.stringify(directValues.values[i])) < 0){
            unusedValues.push(directValues.values[i]);
          }
        }
        if(unusedValues.length === 0){
          // This means all the values have been used - reset
          unusedValues = unusedValues.concat(directValues.values);
          usedValues = [];
        }
        let randomIndex = Math.floor(Math.random() * unusedValues.length);
        let returnValue = unusedValues[randomIndex];
        if(typeof returnValue !== "undefined" && returnValue !== null){
          usedValues.push(returnValue);
          stateAccessor.setStateChain(updatedStateSelectors, usedValues);
        }
        return returnValue;
      }
    }





  }
  return {};
};

module.exports = _responderFunction;
