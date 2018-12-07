"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const ShowEquip = app.model.define("shows_equips", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    created_at: { type: DATE, defaultValue: NOW},
    updated_at: { type: DATE, defaultValue: NOW},
    name: STRING(255),
    show_id: INTEGER,
    equip_id: INTEGER,
    use_count: INTEGER
  });
  ShowEquip.associate = function() {
        app.model.ShowEquip.belongsTo(app.model.Show, { foreignKey: 'show_id', targetKey: 'id' });
        //app.model.ShowEquip.belongsTo(app.model.Equip, { foreignKey: 'equip_id', targetKey: 'id' });
  }
  return ShowEquip;
};
