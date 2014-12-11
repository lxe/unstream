var stream = new require('stream');
var Buffer = new require('buffer').Buffer;

module.exports = function unstream(transform) {
  var tr = new stream.Transform();
  var chunks = [];
  var length = 0;

  tr._transform = function _transform(chunk, enc, cb) {
    chunks.push(chunk);
    length += chunk.length;
    if (this._readableState.ranOut) {
      // TODO: I'm not sure if it's OK to restream a buffer
      // whose size exceeds the highWatermark.
      transform(Buffer.concat(chunks, length).toString(), cb);
    }
  }

  return tr;
};

