var fs = require('fs');
var fileUtilsModule = module.exports;

/*
  check if a file exsit using promise,
  resolve if access function does not return any err
  else reject with the error as a param.
  @param filePath : path to the file to test
*/
fileUtilsModule.isFileExist = function (filePath) {
  return new Promise ((resolve, reject) => {
    fs.access(filePath, (err) => {
      if (err){
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
