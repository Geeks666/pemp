const BaseController = require("../core/base_controller");

class UserController extends BaseController {
  async create() {
    const { ctx } = this;
    const { name, password } = ctx.request.body;

    let data = {};
    if (name == "" || password == "") {
      data = {
        msg: "用户名和密码不能为空"
      };
      this.failed(data);
    } else {
      await ctx.model.User.findOne({
        where: {
          name: name
        }
      })
        .then(async res => {
          if (res != null) {
            data = {
              msg: "用户名已存在"
            };
            this.failed(data);
          } else {
            await ctx.model.User.create({
              name,
              password
            })
              .then(newUser => {
                data = {
                  result: {
                    name: newUser.name
                  },
                  msg: "注册成功"
                };
                ctx.cookies.set("pempToken", newUser.name, {
                  httpOnly: true, // 默认就是 true
                  encrypt: true // 加密传输
                  // maxAge: 2*60*60*1000//两个小时过期
                });
                this.success(data);
              })
              .catch(err => {
                data = {
                  msg: "注册失败"
                };
                this.failed(data);
              });
          }
        })
        .catch(err => {
          data = {
            msg: "注册失败"
          };
          this.failed(data);
        });
    }
  }

  async login() {
    const { ctx } = this;
    const { name, password } = ctx.query;

    let data = {};
    if (name == "" || password == "") {
      data = {
        msg: "用户名和密码不能为空"
      };
      this.failed(data);
    } else {
      await ctx.model.User.findOne({
        where: {
          name,
          password
        }
      })
        .then(user => {
          data = {
            result: {
              name: user.name
            },
            msg: "登录成功"
          };
          ctx.cookies.set("pempToken", user.name, {
            httpOnly: true, // 默认就是 true
            encrypt: true // 加密传输
            // maxAge: 2*60*60*1000//两个小时过期
          });
          this.success(data);
        })
        .catch(err => {
          data = {
            msg: "用户名或密码错误"
          };
          this.failed(data);
        });
    }
  }

  async show() {
    const { ctx } = this;
    const name = ctx.request.name;
    let data = {};

    await ctx.model.User.findOne({
      where: {
        name
      }
    })
      .then(async user => {
        let equipCount = 0;
        equipCount = await ctx.model.Equip.findAndCountAll({
          where: { name }
        });

        data = {
          result: {
            userInfo: {
              equipCount: equipCount.count,
              name: user.name,
              company: user.company,
              postcode: user.postcode,
              address: user.address,
              tel: user.tel,
              remark: user.remark
            }
          }
        };
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async update() {
    const { ctx } = this;
    const name = ctx.request.name;
    const newUserInfo = ctx.request.body;

    let data = {};
    await ctx.model.User.update(newUserInfo, {
      where: {
        name
      }
    })
      .then(user => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async pass() {
    const { ctx } = this;
    const name = ctx.request.name;
    const password = ctx.request.body.oldPass;
    const newPass = ctx.request.body.newPass;

    let data = {};
    await ctx.model.User.findOne({
      where: {
        name,
        password
      }
    })
      .then(async user => {
        if (user != null) {
          await ctx.model.User.update(
            { password: newPass },
            {
              where: {
                name,
                password
              }
            }
          )
            .then(user => {
              this.success(data);
            })
            .catch(err => {
              this.failed(data);
            });
        } else {
          data = {
            msg: "原密码错误"
          };
          this.failed(data);
        }
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async logout() {
    const { ctx } = this;

    let data = {};
    ctx.cookies.set("pempToken", "", {
      httpOnly: true, // 默认就是 true
      encrypt: true, // 加密传输
      expires: new Date()
    });
    this.success(data);
  }
}

module.exports = UserController;
