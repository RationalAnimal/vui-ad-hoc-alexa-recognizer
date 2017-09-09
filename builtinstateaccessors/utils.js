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
 * Call to take either a string or an array of strings where each such string can contain periods and convert to a
 * single array of strings, split using periods.
 * E.g. "one.two.three" is converted to ["one", "two", "three"]
 * E.g. ["one.two.three", "a.b.c", "blah"] is converted to ["one", "two", "three", "a", "b", "c", "blah"]
 * @param keys - a single string or an array of strings.
 * @returns {Array} - array of strings (that don't contain periods)
 * @private
 */
let _unfoldKeys = function(keys){
  if(typeof keys === "undefined" || keys === null){
    return;
  }
  let keyArray = [];
  if(typeof keys === "string"){
    keyArray = keys.split(".");
  }
  else if(Array.isArray(keys)){
    for(let i = 0; i < keys.length; i ++){
      if(typeof keys[i] === "string"){
        keyArray = keyArray.concat(keys[i].split("."));
      }
    }
  }
  return keyArray;
};

let _getSubObject = function(object, keyArray, depth){
  if(typeof object === "undefined" || object === null){
    return;
  }
  if(typeof keyArray === "undefined" || keyArray === null){
    keyArray = [];
  }
  let unfoldedKeys = _unfoldKeys(keyArray);
  let limit = unfoldedKeys.length;
  if(typeof depth === "undefined" || depth === null || Number.isNaN(depth)){
    // Keep limit to be the length of unfolded array
  }
  else {
    if(depth >= 0 && depth < limit){
      limit = depth;
    }
  }
  if(limit > 0){
    let result = object;
    for(let i = 0; i < limit; i++){
      result = result[unfoldedKeys[i]];
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    return result;
  }
  return object;
};

let _ensureSubfieldsPresent = function(objectToUpdate, keys){
  if(typeof objectToUpdate === "undefined" || objectToUpdate === null){
    return;
  }
  if(typeof keys === "undefined" || keys === null){
    return;
  }
  let keyArray = [];
  if(typeof keys === "string"){
    keyArray = keys.split(".");
  }
  else if(Array.isArray(keys)){
    for(let i = 0; i < keys.length; i ++){
      if(typeof keys[i] === "string"){
        keyArray = keyArray.concat(keys[i].split("."));
      }
    }
  }
  if(keyArray.length > 0){
    // First ensure that we have all the "sub" fields
    let result = objectToUpdate;
    for(let i = 0; i < keyArray.length; i++){
      let scratch = result[keyArray[i]];
      if(typeof scratch === "undefined" || scratch === null){
        // We now need to add all the missing fields
        result[keyArray[i]] = {};
        result = result[keyArray[i]];
      }
      else {
        result = scratch;
      }
    }
  }
};

let utils = class {
};

utils.ensureSubfieldsPresent = _ensureSubfieldsPresent;
utils.prototype.ensureSubfieldsPresent = _ensureSubfieldsPresent;

utils.unfoldKeys = _unfoldKeys;
utils.prototype.unfoldKeys = _unfoldKeys;

utils.getSubObject = _getSubObject;
utils.prototype.getSubObject = _getSubObject;


module.exports = utils;
