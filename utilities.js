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
let fs = require("fs");
let path = require("path");

let utilities = {};
utilities.resolveFileName = function(fileName, resolvedBaseDir){
  if(typeof fileName === "undefined" || fileName === null){
    return;
  }
  let resolvedFileName = fileName;
  if(typeof resolvedBaseDir === "string"){
    resolvedFileName = path.join(resolvedBaseDir, fileName);
  }
  else {
    resolvedFileName = path.resolve(fileName);
  }
  return resolvedFileName;
};

utilities.getRelativeFile = function(fileName, resolvedBaseDir){
  if(typeof fileName === "undefined" || fileName === null){
    return;
  }
  let resolvedFileName = fileName;
  if(typeof resolvedBaseDir === "string"){
    resolvedFileName = path.join(resolvedBaseDir, fileName);
  }
  else {
    resolvedFileName = path.resolve(fileName);
  }
  let relativeFilePath = path.relative(resolvedBaseDir, resolvedFileName);
  if(path.isAbsolute(relativeFilePath) === false){
    relativeFilePath = path.join("./", relativeFilePath);
    //relativeFilePath = path.normalize(relativeFilePath);
  }
  return relativeFilePath;
};

utilities.joinPaths = function(fileName, baseDir){
  if(typeof fileName === "undefined" || fileName === null){
    return;
  }
  let joinedFileName = fileName;
  if(typeof baseDir === "string"){
    joinedFileName = path.join(baseDir, fileName);
  }
  path.normalize(joinedFileName);
  return joinedFileName;
};

utilities.loadStringListFromFile = function(fileName, resolvedBaseDir){
  let fileExist = false;
  // compute actual file name when combined with base source directory
  let resolvedFileName = this.resolveFileName(fileName, resolvedBaseDir);

  if (fs.existsSync(resolvedFileName)) {
    // The file name exists and is complete
    fileExist = true;
  }
  if(fileExist === true){
    // TODO replace with a lean solution that doesn't have to read the whole file at once
    let lines = fs.readFileSync(resolvedFileName, "utf-8").split(/\n\r|\n|\r/);
    let result = [];
    let skipCount = 0;
    for(let i = 0; i < lines.length; i++){
      if(lines[i].trim().length > 0){
        result[i - skipCount] = lines[i];
      }
      else {
        skipCount++;
      }
    }
    return result;
  }
};

utilities.loadStringFromFile = function(fileName, resolvedBaseDir){
  let fileExist = false;
  // compute actual file name when combined with base source directory
  let resolvedFileName = this.resolveFileName(fileName, resolvedBaseDir);

  if (fs.existsSync(resolvedFileName)) {
    // The file name exists and is complete
    fileExist = true;
  }
  if(fileExist === true){
    return fs.readFileSync(resolvedFileName, "utf-8");
  }
};

module.exports = utilities;
