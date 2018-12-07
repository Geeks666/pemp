'use strict';

const BaseController = require("./../core/base_controller");

class HomeController extends BaseController {
  async index() {
    const t = this.ctx.cookies.get("pempToken", {
      encrypt: true
    });
    this.success({})
  }
}

module.exports = HomeController;
