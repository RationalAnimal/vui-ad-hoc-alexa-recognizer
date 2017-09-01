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

let _getState = function(key){
  let state = this.applicationState;
  if(typeof state === "undefined" || state === null || typeof key === "undefined" || key === null){
    return;
  }
  let keyArray = [];
  if(typeof key === "string"){
    keyArray = key.split(".");
  }
  if(keyArray.length > 0){
    let result = state;
    for(let i = 0; i < keyArray.length; i++){
      result = result[keyArray[i]];
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    return JSON.parse(JSON.stringify(result));
  }
};

let _getStateChain = function(keyArray){
  let state = this.applicationState;
  if(typeof state === "undefined" || state === null || typeof keyArray === "undefined" || keyArray === null || Array.isArray(keyArray) !== true){
    return;
  }
  let unfoldedKeys = [];
  if(keyArray.length > 0){
    for(let i = 0; i < keyArray.length; i++){
      let key = keyArray[i];
      if(typeof key === "string"){
        let subKeyArray = key.split(".");
        unfoldedKeys = unfoldedKeys.concat(subKeyArray);
      }
      else {
        unfoldedKeys.push(key);
      }
    }
  }
  if(unfoldedKeys.length > 0){
    let result = state;
    for(let i = 0; i < unfoldedKeys.length; i++){
      result = result[unfoldedKeys[i]];
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    return JSON.parse(JSON.stringify(result));
  }
};

let _setState = function(someKey, newValue){
  // NOOP
};

let _setStateChain = function(someKeyArray, newValue){
  // NOOP
};

let _replaceState = function(newState){
  // NOOP
};

let _mergeReplaceState = function(newState, keyArray) {
  // NOOP
};

let BaseStateAccessor = require("./basestateaccessor.js");
let accessor =  class BaseObjectStateAccessor extends BaseStateAccessor {
  constructor(applicationState) {
    super();
    this.applicationState = applicationState;
  }};

accessor.getState = _getState;
accessor.prototype.getState = _getState;

accessor.getStateChain = _getStateChain;
accessor.prototype.getStateChain = _getStateChain;

module.exports = accessor;
