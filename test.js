var assert = require('assert');
var fs = require('fs');
var unstream = require('./unstream');

var upperCaseLicense =
  fs.readFileSync('./LICENSE').toString().toUpperCase();

var timeout = setTimeout(function () {
  throw 'didn\'t pipe within reasonable time'
}, 2000);

fs.createReadStream('./LICENSE')
  .pipe(unstream(transform))
  .pipe(unstream(verify))
  .pipe(process.stdout)
  .on('error', function (err) {
    throw err;
  });

function transform (data, callback) {
  callback(null, data.toUpperCase());
}

function verify (data, callback) {
  clearTimeout(timeout);
  assert(data, 'should actually get here');
  assert(data, upperCaseLicense,
    'should perform the same transform performed on the buffer');
  callback(null, 'OK!');
}

