"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const User = app.model.define("user", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    created_at: { type: DATE, allowNull: false, defaultValue: NOW},
    updated_at: { type: DATE, allowNull: false, defaultValue: NOW},
    name: { type: STRING(255), allowNull: false},
    password: { type: STRING(255), allowNull: false},
    company: STRING(255),
    postcode: STRING(255),
    address: STRING(255),
    tel: STRING(255),
    remark: STRING(255)
  });

  return User;
};
