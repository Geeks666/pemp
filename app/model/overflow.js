"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Overflow = app.model.define("overflow", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    created_at: { type: DATE, allowNull: false, defaultValue: NOW},
    updated_at: { type: DATE, allowNull: false, defaultValue: NOW},
    name: { type: STRING(255)},
    door_id: { type: STRING(255)},
    number: STRING(255),
  });
    Overflow.associate = function() {
        app.model.Overflow.belongsTo(app.model.Store, { foreignKey: 'door_id', targetKey: 'store_number', as: 'storeAlias' });
        app.model.Overflow.belongsTo(app.model.Equip, { foreignKey: 'number', targetKey: 'number', as: 'numberAlias' });
    }
  return Overflow;
};
