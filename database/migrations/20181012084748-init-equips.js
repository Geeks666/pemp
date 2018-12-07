"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, NOW } = Sequelize;
    await queryInterface.createTable("equips", {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      created_at: { type: DATE, defaultValue: NOW },
      updated_at: { type: DATE, defaultValue: NOW },
      name: STRING(255),
      show_name: STRING(255),
      number: STRING(255),
      equip_name: STRING(255),
      brand: STRING(255),
      type: STRING(255),
      count: INTEGER,
      remark: STRING(255)
    });
  },

  down: (queryInterface, Sequelize) => {}
};
