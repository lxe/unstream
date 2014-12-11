# unstream

[![Build Status](https://travis-ci.org/lxe/unstream.svg)](https://travis-ci.org/lxe/unstream)

Like [`concat-stream`](https://github.com/maxogden/concat-stream), except it returns a transform stream, allowing you to continue streaming after concatenation-buffering.

Currently unstream doesn't support object-mode.

#### Q: Uggh, why is this a thing? It's a crime against streams!

A: Sometimes, it is very complex, both in implementation and computation, to perform a complex transform on partial data. Also, sometimes you need the nice .pipe() API, so terminating a stream with `concat-stream` or `bl` won't work.

#### `unstream(function (body, callback) { })`

```javascript
fs.createReadStream('file')
  .pipe(unstream(function (data, callback) {
    callback(null, data.toUpperCase());
  }))
  .pipe(process.stdout);
```

`callback(err, data) { }` is required. This allows you to perform a transform on the fully buffered data, and re-stream it.

#### License

MIT

