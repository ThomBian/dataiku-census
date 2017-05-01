var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var chaiPromised = require('chai-as-promised');
//need to call chai.should() to get access to should
chai.should();
chai.use(chaiPromised);


/*   FILE UTILS TESTS   */
var fileUtilsModule = require('../modules/utils/fileUtils.js');

describe('File Utils Tests', function() {

  it('promise should resolve because dbs/us-census.db exists', function(){
    var filePath = "dbs/us-census.db";
    return fileUtilsModule.isFileExist(filePath).should.be.fulfilled;
  });

  it('promise should reject because dbs/fr-census.db does not exists', function(){
    var filePath = "dbs/fr-census.db";
    return fileUtilsModule.isFileExist(filePath).should.be.rejected;
  });
});
////////////////////////

/* DAO TEST */

var DAO = require('../modules/dao/dao.js');

describe('DAO Module Tests', function(){
  it("should not work because load has not been called", function(){
    return DAO.getAllColumnsName().should.be.rejected;
  });

  it("should get an array of string", function(){
    return DAO.loadDB("dbs/us-census.db").then(DAO.getAllColumnsName)
    .then(data => {
      expect(data).to.not.be.empty;
      expect(data[0]).to.be.a('string');
    });
  });
  /*
    objects are in JSON and like
    {
      "name" : "value",
      "count": value,
      "age" : value
    }
  */
  it("should return an array of object with the proper structure", function(){
    return DAO.loadDB("dbs/us-census.db")
    .then(DAO.getColumnInfos("sex").then(data => {
      var data = JSON.parse(data);
      expect(data).to.not.be.empty;
      expect(data[0]).to.be.a('object');
      var curData = data[0];
      expect(curData["sex"]).to.equal("Female");
      expect(curData["age"]).to.exist.and.to.be.a('number');
      expect(curData["count"]).to.exist.and.to.be.a('number');
    }));
  });

  it("should be sorted by decreasing count (number of rows for a value in a column)", function(){
    return DAO.loadDB("dbs/us-census.db")
    .then(DAO.getColumnInfos("class of worker").then(data => {
      var data = JSON.parse(data);
      for (var i = 0; i < data.length-1; i++) {
        var checkingD = data[i] + " is greater or equal to " + data[i+1];
        assert.isAtLeast(data[i], data[i+1], checkingD);
      }
    }));
  });
  ////////////////////////
});
