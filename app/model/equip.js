"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Equip = app.model.define("equip", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    created_at: { type: DATE, defaultValue: NOW},
    updated_at: { type: DATE, defaultValue: NOW},
    name: STRING(255),
    number: STRING(255),
    equip_name: STRING(255),
    brand: STRING(255),
    type: STRING(255),
    status: INTEGER,
    remark: STRING(255)
  });
    Equip.associate = function() {
        app.model.Equip.belongsTo(app.model.ShowEquip, { foreignKey: 'id', targetKey: 'show_id' });
    }
  return Equip;
};
