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
    var filePath = "test/test-server.js";
    return fileUtilsModule.isFileExist(filePath).should.be.fulfilled;
  });

  it('promise should reject because dbs/fr-census.db does not exists', function(){
    var filePath = "test/no-file.js";
    return fileUtilsModule.isFileExist(filePath).should.be.rejected;
  });

  it('should return one file and the file name is test-server.js', function(done){
    var folderPath = "test";
    fileUtilsModule.getVisiblesFilesInFolder(folderPath).then(files => {
      expect(files).to.not.be.empty;
      expect(files.length).to.be.equal(1);
      expect(files[0]).to.be.equal("test-server.js");
    });
    done();
  });
});
/* END OF FILE UTILS TESTS */

/* DAO TEST */

var DAO = require('../modules/dao/dao.js');

describe('DAO Module Tests', function(){

  before(function(){
    return DAO.loadDB("dbs/us-census.db");
  });

  it("should get an array of string", function(){
    return DAO.getAllColumnsName()
    .then(data => {
      expect(data).to.not.be.empty;
      expect(data[0]).to.be.a('string');
    });
  });

  it("should return an array of object with the proper structure", function(){
    return DAO.getColumnInfos("sex")
    .then(data => {
      var data = JSON.parse(data);
      data = data.data;
      expect(data).to.not.be.empty;
      var curData = data[0];
      expect(curData).to.exist;
      expect(curData).to.be.a('object');
      expect(curData["columnValue"]).to.equal("Female");
      expect(curData["age"]).to.exist.and.to.be.a('string');
      expect(curData["count"]).to.exist.and.to.be.a('number');
    });
  });

  it("should be sorted by decreasing count (number of rows for a value in a column)", function(){
    return DAO.getColumnInfos("class of worker").then(data => {
      var data = JSON.parse(data);
      data = data.data;
      for (var i = 0; i < data.length-1; i++) {
        var checkingD = data[i] + " is greater or equal to " + data[i+1];
        assert.isAtLeast(data[i], data[i+1], checkingD);
      }
    });
  });

  it("should not clip out values", function(){
    return DAO.getColumnInfos("sex").then(data=>{
      var data = JSON.parse(data);
      expect(data.valuesOut).to.exist;
      assert.equal(0, data.valuesOut, "0 value clipped out");
    });
  });

  it("should have some clipped out values", function(){
    return DAO.getColumnInfos("wage per hour").then(data=>{
      var data = JSON.parse(data);
      expect(data.valuesOut).to.exist;
      assert.equal(1141, data.valuesOut, "1141 values clipped out");
    });
  });

  it ("should not clip any rows", function(){
    //clipped for test purpose after 7 results => no clipping
    var counter = 7;
    var rows = [
      {"test": "test1", "age":33, "count": 96},
      {"test": "test2", "age":34, "count": 25},
      {"test": "test3", "age":35, "count": 24},
      {"test": "test4", "age":36, "count": 22},
      {"test": "test5", "age":37, "count": 18},
      {"test": "test6", "age":38, "count": 10},
      {"test": "test7", "age":39, "count": 2}
    ];
    var sum = DAO.getNbRowsOut(rows, counter);
    assert.equal(0, sum, "it should not clip any rows");
  });

  it ("should have the proper number of rows clipped out", function(){
    //clipped for test purpose after 3 results
    var counter = 3;
    var rows = [
      {"test": "test1", "age":33, "count": 96},
      {"test": "test2", "age":34, "count": 25},
      {"test": "test3", "age":35, "count": 24},
      {"test": "test4", "age":36, "count": 22},
      {"test": "test5", "age":37, "count": 18},
      {"test": "test6", "age":38, "count": 10},
      {"test": "test7", "age":39, "count": 2}
    ];

    //expect to sum the count from index 3 to the end
    var expected = 22 + 18 + 10 + 2;
    var sum = DAO.getNbRowsOut(rows, counter);
    assert.equal(expected, sum, expected + " is the same as " + sum);
  });
});

/* END OF DAO TESTS */
