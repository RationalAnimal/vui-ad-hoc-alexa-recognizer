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
var fs = require('fs');

var utilities = {};
utilities.loadStringListFromFile = function(fileName){
  var fileExist = false;
  if (fs.existsSync(fileName)) {
    // The file name exists and is complete
    fileExist = true;
  }
  else if(fs.existsSync("./" + fileName)){
    // Need to prepend "./"
    fileName = "./" + fileName;
    fileExist = true;
  }
  if(fileExist == true){
    // TODO replace with a lean solution that doesn't have to read the whole file
    // at once
    var lines = fs.readFileSync(fileName, 'utf-8')
    .split(/\n\r|\n|\r/);
//    console.log("Loaded lines from file: " + JSON.stringify(lines, null, 2))
    var result = [];
    var skipCount = 0;
    for(var i = 0; i < lines.length; i++){
      if(lines[i].trim().length > 0){
        result[i - skipCount] = lines[i];
      }
      else {
        skipCount++;
      }
    }
//    console.log("Resulting lines from file: " + JSON.stringify(result, null, 2))
    return result;
  }
  return; // nothing
}

module.exports = utilities;
