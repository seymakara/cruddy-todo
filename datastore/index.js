const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

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
  fs.readdir(exports.dataDir, (err, files) => {
    files.map((file) => {
      const content = {
        id: file.slice(0, 5),
        text: file.slice(0, 5)
      };
      data.push(content);
    });
    callback(null, data);
  });
};
exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
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
  // if (files.includes(`${id}.txt`)) {
  //   console.log('ID exists');
  //   fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
  //     if (err) {
  //       console.log('here')
  //     } else {
  //       callback(err, text);
  //     }
  //   });
  // } else {
  //   console.log('ID does not exist');
  // }

  // if (err) {
  //   callback(err, 0);
  // } else {
  //   if (files.includes(`${id}.text`)) {
  //     fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
  //       if (err) {
  //         console.log('here');
  //         return;
  //       } else {
  //         callback(null, text);
  //       }
  //     });
  //   }
  // }
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
  

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
