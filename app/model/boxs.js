"use strict";

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const Boxs = app.model.define("boxs", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    equip_list_number: STRING(255), /*设备编号码*/
    box_number: STRING(50), /*箱子编码*/
    quantity: INTEGER,      /*箱子数量*/
    show_id: INTEGER,       /*演出id*/
    equip_id: INTEGER,      /*设备id*/
    equip_name: STRING(50), /*设备名称*/
    brand: STRING(50),      /*设备品牌*/
    type: STRING(100),      /*设备编号*/
    check: STRING(20),      /*装卸校对*/
    name: STRING(255),      /*箱子创建人*/
    created_at: { type: DATE, defaultValue: NOW},
    updated_at: { type: DATE, defaultValue: NOW},
  });

  return Boxs;
};
