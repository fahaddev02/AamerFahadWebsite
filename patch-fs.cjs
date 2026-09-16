const fs = require('fs');

function wrapError(err) {
  if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'EINVAL')) {
    const e = new Error('EINVAL: invalid argument, readlink');
    e.code = 'EINVAL';
    return e;
  }
  return err;
}

const origReadlink = fs.readlink;
fs.readlink = function (...args) {
  const cb = args[args.length - 1];
  if (typeof cb === 'function') {
    return origReadlink.call(fs, ...args.slice(0, -1), (err, linkString) => {
      if (err) return cb(wrapError(err));
      return cb(null, linkString);
    });
  }
  try {
    return origReadlink.apply(fs, args);
  } catch (err) {
    throw wrapError(err);
  }
};

const origReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (...args) {
  try {
    return origReadlinkSync.apply(fs, args);
  } catch (err) {
    throw wrapError(err);
  }
};

if (fs.promises && fs.promises.readlink) {
  const origPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (...args) {
    try {
      return await origPromisesReadlink.apply(fs.promises, args);
    } catch (err) {
      throw wrapError(err);
    }
  };
}
