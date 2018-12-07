"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Show = app.model.define("show", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    created_at: { type: DATE, defaultValue: NOW },
    updated_at: { type: DATE, defaultValue: NOW },
    name: STRING(255),
    show_name: STRING(255),
    data_date: STRING(255),
    remark: STRING(255)
  });

  return Show;
};
