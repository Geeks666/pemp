const { Controller } = require("egg");

class BaseController extends Controller {
  /*getUserToken() {
    const name = this.ctx.cookies.get("pempToken", {
      encrypt: true
    });
    return name;
  }*/
  success(data) {
    this.ctx.body = {
      code: 200,
      result: data.result || {},
      msg: data.msg || "操作成功"
    };
  }
  failed(data){
    this.ctx.body = {
      code: 400,
      result: data.result || {},
      msg: data.msg || "操作失败"
    };
  }
  error(data){
    this.ctx.body = {
      code: 401,
      result: data.result || {},
      msg: data.msg || "未登录或登录有效期已过，请重新登录"
    };
  }
}

module.exports = BaseController;
