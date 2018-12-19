module.exports = options => {
  return async function verifyUser(ctx, next) {
      console.log( ctx.path );
    if (ctx.path != "/api/login" && ctx.path != "/api/reg" && ctx.path != "/api/app_box/create" && ctx.path != "/api/app_box/search" && ctx.path != "/api/app_box/delete" && ctx.path != "/api/app/msg_menu" && ctx.path != "/api/app/check_boxs" && ctx.path != "/api/app/msg" && ctx.path != "/api/app/do_equip_name" && ctx.path != "/api/app/do_equip_brand" && ctx.path !="/api/shows/update_check") {
      const name = ctx.cookies.get("pempToken", {
        encrypt: true
      });

      if (!name || name == "") {
        ctx.body = {
          code: 401,
          result: {},
          msg: "未登录或登录有效期已过，请重新登录"
        };
        return;
      } else {
        ctx.request.name = name;
      }
    }

    await next();
  };
};
