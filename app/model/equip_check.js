"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const EquipCheck = app.model.define("equip_checks", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    equip_list_number: STRING(255), /*设备唯一编码*/
    status: STRING(10), /*匹配状态*/
    shows_id: INTEGER,      /*箱子数量*/
    equip_id: INTEGER,      /*箱子数量*/
    created_at: { type: DATE, defaultValue: NOW},
    updated_at: { type: DATE, defaultValue: NOW},
  });
    EquipCheck.associate = function() {
        app.model.EquipCheck.belongsTo(app.model.Equip, { foreignKey: 'show_id', targetKey: 'id' });
    }
  return EquipCheck;
};
