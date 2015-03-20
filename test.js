'use strict';

var fmt = require('util').format;
var assert = require('assert');
var fs = require('fs');
var unstream = require('./unstream');

var upperCaseLicense =
  fs.readFileSync('./LICENSE').toString().toUpperCase();

var limit = 9;
var customError = Error('error occured');

/* istanbul ignore next */
var timeout = setTimeout(function () {
  throw 'didn\'t pipe within reasonable time'
}, 2000);

fs.createReadStream('./LICENSE', { highWaterMark: 16 })
  // Limit tests
  .pipe(unstream({limit: limit}, transform))
  .on('error', verifyLimit)

  // No options passed + passthrough
  .pipe(unstream(null, passthrough))

  // Call back with an error
  .pipe(unstream(errorCallback))
  .on('error', verifyError)

  // Verify transform
  .pipe(unstream(verify))
  .pipe(process.stdout);

function passthrough(data, callback) {
  callback(null, data);
}

function errorCallback(data, callback) {
  callback(customError, data);
}

function transform(data, callback) {
  callback(null, data.toString().toUpperCase());
}

function verifyLimit(err) {
  assert(unstream.LIMIT_EXCEEDED_ERR_TEMPLATE)
  assert(err.message ===
    fmt(unstream.LIMIT_EXCEEDED_ERR_TEMPLATE, limit),
    'emits a limit exceeded error');
}

function verifyError(err) {
  assert(err === customError, 'should emit custom error')
}

function verify(data, callback) {
  clearTimeout(timeout);
  assert(data, 'should actually get here');
  assert(data.toString() === upperCaseLicense.slice(0, limit),
    'should perform the same transform performed on the buffer');
  callback(null, 'Test Passed!\n');
}

