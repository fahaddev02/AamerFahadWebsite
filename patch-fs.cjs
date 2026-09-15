const fs = require('fs');

const origReadlink = fs.readlink;
fs.readlink = function (...args) {
  const cb = args[args.length - 1];
  if (typeof cb === 'function') {
    return origReadlink.call(fs, ...args.slice(0, -1), (err, linkString) => {
      if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'EINVAL')) {
        const e = new Error('EINVAL: invalid argument, readlink');
        e.code = 'EINVAL';
        return cb(e);
      }
      return cb(err, linkString);
    });
  }
  try {
    return origReadlink.apply(fs, args);
  } catch (err) {
    if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'EINVAL')) {
      const e = new Error('EINVAL: invalid argument, readlink');
      e.code = 'EINVAL';
      throw e;
    }
    throw err;
  }
};

const origReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (...args) {
  try {
    return origReadlinkSync.apply(fs, args);
  } catch (err) {
    if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'EINVAL')) {
      const e = new Error('EINVAL: invalid argument, readlink');
      e.code = 'EINVAL';
      throw e;
    }
    throw err;
  }
};

if (fs.promises && fs.promises.readlink) {
  const origPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (...args) {
    try {
      return await origPromisesReadlink.apply(fs.promises, args);
    } catch (err) {
      if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN' || err.code === 'EINVAL')) {
        const e = new Error('EINVAL: invalid argument, readlink');
        e.code = 'EINVAL';
        throw e;
      }
      throw err;
    }
  };
}

