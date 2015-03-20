'use strict';

var fmt = require('util').format;
var inherits = require('util').inherits;
var Transform = require('stream').Transform;
var Buffer = require('buffer').Buffer;

module.exports = Unstream;

var LIMIT_EXCEEDED_ERR_TEMPLATE =
  module.exports.LIMIT_EXCEEDED_ERR_TEMPLATE =
  'Buffer limit exceeded. Truncating to %d bytes';

inherits(Unstream, Transform);

function Unstream(opts, transformFn) {
  if (!(this instanceof Unstream)) {
    return new Unstream(opts, transformFn);
  }

  this.id = Math.random();

  if (typeof opts === 'function') {
    this.transformFn = opts;
    this.opts = { };
  } else {
    this.transformFn = transformFn;
    this.opts = opts || { };
  }

  this.limit = this.opts.limit || Infinity;
  this.limitExceeded = false;

  this.chunks = [];
  this.length = 0;

  Transform.call(this, opts);
}

Unstream.prototype._transform = function _transform(chunk, enc, cb) {
  if (this.limitExceeded) return cb();

  this.length += chunk.length;

  if (this.length > this.limit) {
    this.chunks.push(chunk.slice(0, this.limit));
    this.limitExceeded = true;
  } else {
    this.chunks.push(chunk);
  }

  cb();
};

Unstream.prototype._flush = function _flush(cb) {
  var self = this;

  if (this.limitExceeded) {
    this.emit('error', new Error(
      fmt(LIMIT_EXCEEDED_ERR_TEMPLATE, this.limit)));
  }

  this.transformFn(
    Buffer.concat(this.chunks, this.length),
    transformCallback);

  function transformCallback(err, data) {
    self.push(data);
    if (err) self.emit('error', err);
    cb();
  }
};
