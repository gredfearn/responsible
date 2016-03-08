require(TEST_HELPER) // <--- This must be at the top of every test file.

var request = require('supertest')
var Tutorial = require(__server + '/models/user-api.js');


describe("The Tutorial API", function() {
  var app = null;
  beforeEach(function(done){
    app = TestHelper.createApp();
    TestHelper.emptyDatabase().then(function(){
      done();
    });
  })

  it_("return all tutorials on /api/tutorials", function * () {
    yield Tutorial.insert({title : "A tutorial"});
    yield request(app)
      .get('/api/tutorials')
      .expect(200)
      .expect(function(response) {
        expect(response.body[0]).to.include({title : "A tutorial"});
      })
  })
  it_(...)
