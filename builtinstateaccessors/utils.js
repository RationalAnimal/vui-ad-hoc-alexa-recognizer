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
"use strict";

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

/**
 * Call to get a "sub object" of the provide object using the keys, optionally up to specified depth (optionally).
 * E.g. given object {"a" : {"b": {"c" : "Extracted"}}} and keyArray ["a", "b"] or ["a.b"] or "a.b" the return value
 * will be {"c": "Extracted}
 * @param object - object from which to extract sub object
 * @param keyArray - keys to use for selecting sub object.  Keys are first "expanded" via a call to unfoldKeys()
 * @param depth - optional, allows selection for a shallower depth than specified by keyArray.  For example, if
 * keyArray is ["a", "b", "c"] and the depth is 2, then this is equivalent to calling this function with the
 * keyArray of ["a", "b"].
 * @returns {*} - sub object
 * @private
 */
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
      if(result === null && i === limit - 1){
        return result;
      }
      if(typeof result === "undefined" || result === null){
        return;
      }
    }
    return result;
  }
  return object;
};

/**
 * Call this to ensure that the sub field specified by the keys argument is present
 * E.g. if given objectToUpdate {"a": {"b": {}} and keys "a.b.c" the objectToUpdate after this call will be:
 * {"a": {"b": {"c" : {}}}
 * @param objectToUpdate - this is the object within wich we want to make sure the subfield is present
 * @param keys - key that specify sub field.  These will first be "unfolded" via unfoldKeys()
 * @private
 */
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

/**
 * Call this function to merge information in the keys and in the trustSpec as well as fill in any missing pieces
 * with default information.
 * @param keys - selector keys (or "pre" keys, typically not present)
 * @param trustSpec - object that contains trust information about the sub domain.  This is optional and may be missing,
 * in which case it uses some default values.
 * @retuns object that is the same in structure as the trustSpec, but has combined information from keys and trustSpec
 * arguments, filling in/changing where needed based on the values of the arguments.
 * @private
 */
let _mergeKeysAndTrustedSpec = function(keys, trustSpec){
  if(typeof trustSpec === "undefined" || trustSpec === null){
    trustSpec = {"read": false, "write": false, "sandBoxKeys": ["untrusted"]};
  }
  let unfoldedKeys = _unfoldKeys(keys);
  if(typeof unfoldedKeys === "undefined" || unfoldedKeys === null){
    unfoldedKeys = [];
  }
  // TODO for now only handle the case of either fully trusted or fully untrusted sub domain
  if(trustSpec.read === true && trustSpec.write === true){
    if(typeof trustSpec.selector === "undefined" || trustSpec.selector === null){
      // No need to adjust unfoldedKeys
    }
    else if(typeof trustSpec.selector === "string" || Array.isArray(trustSpec.selector)){
      let unfoldedTrustSelector = _unfoldKeys(trustSpec.selector);
      if(typeof unfoldedKeys === "undefined" || unfoldedKeys === null || Array.isArray(unfoldedKeys) !== true){
        unfoldedKeys = unfoldedTrustSelector;
      }
      else {
        unfoldedKeys = unfoldedKeys.concat(unfoldedTrustSelector);
      }
    }
    let returnValue = JSON.parse(JSON.stringify(trustSpec));
    returnValue.selector = unfoldedKeys;
    return returnValue;
  }
  else if(trustSpec.read === false && trustSpec.write === false){
    // Fully untrusted sub accessor
    let sandBoxKeys = _unfoldKeys(trustSpec.sandBoxKeys);
    if(typeof sandBoxKeys === "undefined" || sandBoxKeys === null || (Array.isArray(sandBoxKeys) && sandBoxKeys.length === 0)){
      sandBoxKeys = ["untrusted"];
    }
    unfoldedKeys = unfoldedKeys.concat(sandBoxKeys);
    if(typeof trustSpec.selector === "undefined" || trustSpec.selector === null){
      // No need to adjust unfoldedKeys
    }
    else if(typeof trustSpec.selector === "string" || Array.isArray(trustSpec.selector)){
      let unfoldedTrustSelector = _unfoldKeys(trustSpec.selector);
      unfoldedKeys = unfoldedKeys.concat(unfoldedTrustSelector);
    }
    let returnValue = JSON.parse(JSON.stringify(trustSpec));
    returnValue.selector = unfoldedKeys;
    return returnValue;
  }
  else if(trustSpec.write !== true && trustSpec.read === true){
    // Write restricted - can read the real state, but can't write it. NOT the same as read only. Can actually write,
    // but until written will read the real value.  After the first write will read the written value.
    // TODO think this through
  }
  else if(trustSpec.write === true && trustSpec.read !== true){
    // TODO continue from here

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

utils.mergeKeysAndTrustedSpec = _mergeKeysAndTrustedSpec;
utils.prototype.mergeKeysAndTrustedSpec = _mergeKeysAndTrustedSpec;

module.exports = utils;
