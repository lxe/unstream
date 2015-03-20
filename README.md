# unstream

[![Build Status](https://travis-ci.org/lxe/unstream.svg)](https://travis-ci.org/lxe/unstream) [![Coverage Status](https://coveralls.io/repos/lxe/unstream/badge.svg)](https://coveralls.io/r/lxe/unstream)

Like [`concat-stream`](http://ghub.io/concat-stream), or [`bl`](http://ghub.io/bl) except it returns a transform stream, allowing you to continue streaming after concat-buffering.

Currently unstream doesn't support object-mode.

#### `unstream(options, transformFn (body, callback(err, data)) { })`

```javascript
var unstream = require('unstream');

fs.createReadStream('file')
  .pipe(unstream({ limit: 1024 }, function (data, callback) {
    callback(null, data.toUpperCase());
  }))
  .pipe(process.stdout);
```

#### `options`

Options object. Same as [`TransformStream`](https://nodejs.org/api/stream.html#stream_class_stream_transform_1) options, plus some extras:

 - `limit [Number]` - maximum number of bytes to buffer. The default is `Infinity`. Set this to a hard limit to prevent memory leaks.

#### `transformFn (body, callback) { }`

Function that gets called when the buffering is complete.

 - `body [Buffer]` - fully buffered data from the source stream.
 - `callback(err, data)` - Call this to continue streaming the `data` to the destination. This allows you to perform a transform on the fully buffered data, and re-stream it.

#### License

MIT

