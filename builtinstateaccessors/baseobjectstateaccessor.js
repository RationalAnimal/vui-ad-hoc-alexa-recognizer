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

let _getState = function(state, key){
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

let _getStateChain = function(state, keyArray){
  if(typeof state === "undefined" || state === null || typeof keyArray === "undefined" || keyArray === null || Array.isArray(keyArray) !== true){
    return;
  }
  if(keyArray.length > 0){
    let result = state;
    for(let i = 0; i < keyArray.length; i++){
      result = _getState(result, keyArray[i]);
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    return JSON.parse(JSON.stringify(result));
  }
};

let _setState = function(state, someKey, newValue){
  // NOOP
};

let _setStateChain = function(state, someKeyArray, newValue){
  // NOOP
};

let _replaceState = function(state, newState){
  // NOOP
};

let _mergeReplaceState = function(state, newState, keyArray) {
  // NOOP
};

let accessor =  class BaseObjectStateAccessor {
  constructor(applicationState) {
    this.applicationState = applicationState;
  }};

accessor.getState = _getState;
accessor.prototype.getState = _getState;

accessor.getStateChain = _getStateChain;
accessor.prototype.getStateChain = _getStateChain;

module.exports = accessor;
