const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

Promise.promisifyAll(fs);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, countString) => {
    fs.writeFile(`${exports.dataDir}/${countString}.txt`, text, (err) => {
      if (err) {
        throw err;
      } else {
        const contents = {
          text: text,
          id: countString
        };
        callback(null, contents);
      }
    });
  });
};

exports.readAll = (callback) => {
  let data = [];
  fs.readdirAsync(exports.dataDir).then((filenames) => {
    const data = filenames.map((file) => {
      return fs.readFileAsync(exports.dataDir + '/' + file, 'utf8').then((text) => {
        return { id: file.split('.')[0], text };
      });
    });
    Promise.all(data)
      .then(databits => {
        callback(null, databits);
      }, err => callback(err));
  });
};
exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, text) => {
    if (err) {
      callback(err, 0);
    } else {
      const contents = {
        id,
        text
      };
      callback(err, contents);
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access(`${exports.dataDir}/${id}.txt`, fs.constants.F_OK, (err) => {
    if (err) {
      callback(err, 'error at access');
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err, 'here');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
