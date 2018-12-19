"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get("/api/getToken", controller.home.index);

  router.post("reg", "/api/reg", controller.user.create);
  router.get("login", "/api/login", controller.user.login);
  router.get("logout", "/api/logout", controller.user.logout);
  router.get("getUserInfo", "/api/user", controller.user.show);
  router.post("setUserInfo", "/api/user", controller.user.update);
  router.post("setUserPass", "/api/pass", controller.user.pass);

  router.get("getCheckEquipsList", "/api/check_equips", controller.equip.check_search);
  router.get("getEquipsList", "/api/equips", controller.equip.search);
  router.post("addEquip", "/api/equips/add", controller.equip.add);
  router.post("updateEquip", "/api/equips/update", controller.equip.update);
  router.post("deleteEquip", "/api/equips/delete", controller.equip.delete);

  router.get("getShowsList", "/api/shows", controller.show.search);
  router.post("addShow", "/api/shows/add", controller.show.add);
  router.post("deleteShow", "/api/shows/delete", controller.show.delete);
  router.post("updateShow", "/api/shows/update", controller.show.update);
  router.post("ShowSearch", "/api/shows/list", controller.show.searchShow);

  router.get("selectedEquip", "/api/shows/selected_equips", controller.showEquip.selected_equips);
  router.get("selectionEquips", "/api/shows/selection_equips", controller.showEquip.selection_equips);

  router.post("selectedEquipAdd", "/api/shows/selected_equip_add", controller.showEquip.selected_equip_add);
  router.post("selectedEquipUpdate", "/api/shows/selected_equip_update", controller.showEquip.selected_equip_update);
  router.post("selectedEquipDel", "/api/shows/selected_equip_delete", controller.showEquip.selected_equip_delete);

  router.get("getResidueEquips", "/api/shows/residue_equips", controller.showEquip.residue_equips);
  router.post("output_scan", "/api/scan/output", controller.scan.output);
  router.post("putaway_scan", "/api/scan/putaway", controller.scan.putaway);
  /* app */
  /* test */
  router.post("searchCheck", "/api/check/search", controller.scan.check_search);
  /*store*/
  router.post("searchStore", "/api/store/serach", controller.store.serach);
  router.post("createStore", "/api/store/create", controller.store.create);
  router.post("deleteStore", "/api/store/delete", controller.store.delete);
  router.post("updateStore", "/api/store/update", controller.store.update);
  router.post("getNoticeList", "/api/notice/serach", controller.store.noticeSerach);

  router.get("getMsg", "/api/app/msg", controller.box.msg);
  //router.post("createNumber", "/api/shows/greate_check", controller.showEquip.greateCheck);
  router.post("createbox", "/api/app_box/create", controller.box.create);


  /*router.get("getEquipName", "/api/app/do_equip_name", controller.box.equipName);
  router.get("getEquipBrand", "/api/app/do_equip_brand", controller.box.equipBrand);
  router.get("getEquipType", "/api/app/do_equip_type", controller.box.equipType);*/
  router.post("search", "/api/app_box/search", controller.box.search);
  router.post("delete", "/api/app_box/delete", controller.box.delete);


  router.post("getcheckequip", "/api/app/check_equip", controller.box.check_equip);
  // router.post("updateNumber", "/api/shows/update_check", controller.showEquip.updateCheck);



  // router.post("getDownMenu", "/api/app/msg_menu", controller.box.msg_menu);
  router.get("getcheckBox", "/api/app/check_boxs", controller.box.check_boxs);

};
