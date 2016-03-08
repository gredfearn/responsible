process.env.NODE_ENV = 'test'

// The following allows you to require files independent of
// the location of your test file.
// Example:
//  var User = require(__server + '/models/user.js')
//
global.__server = __dirname + '/../server'
global.__client = __dirname + '/../client'

var db = require(__server + '/lib/db.js');
//
// Assertions
//
var chai = require('chai')
// Option 1: Make the `expect` function available in every test file
global.expect = chai.expect
// Option 2: Make everything should-able
// global.should = chai.should()
//
// Mock apps for API testing
//
var express = require('express')
var routes = require(__server + '/index.js');

// This is the object you can attach any helper functions used across
// several test files.
global.TestHelper = {

}


TestHelper.createApp = function (loader) {
  var app = express()
  app.use(require('body-parser').json())
  TestHelper.loadRoutes(app);
  return app
}


TestHelper.loadRoutes = function(app) {
    routes.use(function(err, req, res, next){
      console.error("==Error==")
      console.error("   " + err.stack)
      next(err)
    });
    app.use('/', routes);
}

//
// Monkey-patch mocha's `it` function
// to support `yield` within generator functions
// for pleasant test writing.
//
// Thanks goes to http://stackoverflow.com/a/23029774/49695
//
var Bluebird = require('bluebird')

global.before_ = function (f) { before ( Bluebird.coroutine(f) ) }
global.beforeEach_ = function (f) { beforeEach ( Bluebird.coroutine(f) ) }
global.it_ = function (description, f) { it ( description, Bluebird.coroutine(f) ) }
global.xit_ = function (description, f) { xit ( description, f ) }
global.it_.only = function (description, f) { it.only( description, Bluebird.coroutine(f) ) }
