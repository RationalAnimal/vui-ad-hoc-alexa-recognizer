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

let BaseObjectStateAccessor = require("./baseobjectstateaccessor.js");
let accessor =  class BaseWritableObjectStateAccessor extends BaseObjectStateAccessor {
  constructor(applicationState) {
    super(applicationState);
  }
};

let _setState = function(key, newValue){
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
    for(let i = 0; i < keyArray.length - 1; i++){
      result = result[keyArray[i]];
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    if(typeof newValue === "undefined" || newValue === null){
      delete result[keyArray[keyArray.length - 1]];
    }
    else {
      result[keyArray[keyArray.length - 1]] = newValue;
    }
  }
};

let _getSubStateAccessor = function(key){
  _ensureSubFieldsPresent(this.applicationState, key);

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
    }
    return new BaseObjectStateAccessor(result);
  }
};

accessor.setState = _setState;
accessor.prototype.setState = _setState;

module.exports = accessor;
