module.exports = options => {
  return async function verifyUser(ctx, next) {
      console.log( ctx.path );
    if (ctx.path != "/api/login" && ctx.path != "/api/reg" && ctx.path != "/api/check/search" && ctx.path !="/api/shows/update_check") {
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
