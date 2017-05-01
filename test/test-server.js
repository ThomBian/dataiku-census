var chai = require('chai');
var expect = chai.expect;


/*   FILE UTILS TESTS   */
var fileUtilsModule = require('../modules/utils/fileUtils.js');

describe('fileUtilsTest', function() {
  
  it('promise should resolve because dbs/us-census.db exists', function(){
    var filePath = "dbs/us-census.db";
    return fileUtilsModule.isFileExist(filePath).then(() => {});
  });

  it('promise should reject because dbs/fr-census.db does not exists', function(){
    var filePath = "dbs/fr-census.db";
    return fileUtilsModule.isFileExist(filePath).then(() => {
      throw new Error('was not supposed to succeed');
    }).catch((err) => {
      expect(err).to.be.ok;
      expect(err.message).to.be.equal("ENOENT: no such file or directory, access '"+filePath+"'");
    });
  });
});
////////////////////////
