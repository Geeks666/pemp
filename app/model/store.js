"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Store = app.model.define("store", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    store_name: STRING(255),
    store_number: STRING(255),
    address: STRING(255),
    user_id: INTEGER,
    created_at: { type: DATE, allowNull: false, defaultValue: NOW},
    updated_at: { type: DATE, allowNull: false, defaultValue: NOW}
  });

  return Store;
};
