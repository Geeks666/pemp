"use strict";

// had enabled by egg
// exports.static = true;

exports.validate = {
  enable: true,
  package: "egg-validate"
};

exports.sequelize = {
  enable: true,
  package: "egg-sequelize"
};

// {app_root}/config/plugin.js
exports.cors = {
    enable: true,
    package: 'egg-cors',
    credentials: true,
};

// exports.alinode = {
//   enable: true,
//   package: "egg-alinode"
// };