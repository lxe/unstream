# unstream

Like [`concat-stream`](https://github.com/maxogden/concat-stream), except it returns a transform stream, allowing you to continue streaming after concatenation-buffering.

Currently unstream doesn't support object-mode.

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

