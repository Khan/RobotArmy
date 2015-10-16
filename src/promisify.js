/**
 * A helper fn for turning a node-style callbacky function into a fn that
 * returns a promise.
 *
 * Usage:
 * await prom(done => myCallbackyFunction(done));
 *
 * TODO(jared): I'm having a hard time making flow understand this stuff.
 */

export default function promisify(fn) {
    return new Promise((res, rej) => fn(
      (err, val) => err ? rej(err) : res(val)
    ));
};

