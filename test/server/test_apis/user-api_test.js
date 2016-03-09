require(TEST_HELPER)
// var db = require(__server + '/lib/db')
var request = require('supertest-as-promised')
var routes = require(__server + '/index.js')

describe("User API", function() {

  var app = TestHelper.createApp()

  app.use('/user', routes)
  app.testReady()

  // beforeEach(function() {
  //   return db.deleteEverything()
  })

  it("Should insert user", function(app) {

    // Mocha will wait for returned promises to complete
    return request(app)
      .post('/user')
      .send({ name: 'Grant', address: '700 rock ledge'})
      .expect(201)
      .expect(function(response) {
        var user = response.body

        expect(user.id).to.not.be.undefined
        expect(user.name).to.equal('Grant')
        expect(user.addres).to.equal('700 rock ledge')
      })
      .then(function(){

        return request(app)
          .get('/user')
          .expect(200)
          .expect(function(response) {
            var users = response.body
            expect(users).to.be.an.instanceOf(Array)
            expect(users).to.have.length(1)
            expect(users[0].name).to.equal('Grant')
          })
      })
  })
