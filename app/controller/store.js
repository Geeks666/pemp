const BaseController = require("../core/base_controller");

class StoreController extends BaseController {
  async create() {
    const {ctx} = this;
    const name = ctx.request.name;
    const {store_name, store_number, address, remark} = ctx.request.body;
    let data = {};
    let paramData = await ctx.model.Store.findOne({
      where: {store_name, store_number}
    })
    if (!paramData) {
      let paramUserData = await ctx.model.User.findOne({
        where: {name}
      });
      let user_id = paramUserData.dataValues.id;
      await ctx.model.Store.create({
        store_name,
        store_number,
        address,
        user_id,
        remark
      })
        .then(cres => {
          this.success(data);
        })
        .catch(err => {
          this.failed(data);
        });
    }
  }

  async delete() {
    const {ctx} = this;
    //const name = ctx.request.name;
    const {id} = ctx.request.body;
    let data = {};
    await ctx.model.Store.destroy({
      where: {id}
    })
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async serach() {
    const {ctx} = this;
    const name = ctx.request.name;
    const {store_name} = ctx.request.body;
    let data = {};
    let user_id = 0;
    await ctx.model.User.findOne({
      where: {
        name
      }
    })
      .then(async user => {
        if (user) {
          user_id = user.dataValues.id;
        }
      })
      .catch(err => {
        this.failed(data);
      });
    await ctx.model.Store.findAll({
      where: {
        user_id,
        store_name: {
          $like: '%' + store_name + '%'
        }
      }
    })
      .then(async res => {
        data.result = res;
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async noticeSerach() {
    const {ctx} = this;
    const name = ctx.request.name;
    let data = {};
    let number = "";
    await ctx.model.User.findOne({
      where: {
        name
      }
    })
      .then(async user => {
        if (user) {
          number = user.dataValues.number;
        }
      })
      .catch(err => {
        this.failed(data);
      });
    await ctx.model.Overflow.findAll({
      attributes: ['number', ctx.model.col('storeAlias.address'), ctx.model.col('numberAlias.equip_name')],
      where: {
        number: {
          $like: number + '%'
        }
      },
      include: [{
        model: ctx.model.Store,
        as: 'storeAlias',
        attributes: []
      }, {
        model: ctx.model.Equip,
        as: 'numberAlias',
        attributes: []
      }],
      raw: true
    })
      .then(async res => {
        console.log(res)
        if (res) {
          data.result = res;
        } else {
          data.result = {};
        }
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async noticeOtherSerach() {
    const {ctx} = this;
    const name = ctx.request.name;
    let data = {};
    let number = "";
    await ctx.model.Overflow.findAll({
      attributes: ['number', ctx.model.col('storeAlias.address'), ctx.model.col('numberAlias.equip_name')],
      where: { name },
      include: [{
        model: ctx.model.Store,
        as: 'storeAlias',
        attributes: []
      }, {
        model: ctx.model.Equip,
        as: 'numberAlias',
        attributes: []
      }],
      raw: true
    })
      .then(async res => {
        console.log(res)
        if (res) {
          data.result = res;
        } else {
          data.result = {};
        }
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async update() {
    const {ctx} = this;
    const name = ctx.request.name;
    const {id, address, store_name, store_number} = ctx.request.body;
    let data = {};
    await ctx.model.Store.update(
      {address, store_name, store_number},
      {
        where: {
          id
        }
      }
    )
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async pass() {
    const {ctx} = this;
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
            {password: newPass},
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
}

module.exports = StoreController;
