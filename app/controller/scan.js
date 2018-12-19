var moment = require("moment");
const BaseController = require("./../core/base_controller");

class ScanController extends BaseController {
  async putaway() {
    const {ctx} = this;
    const name = ctx.request.name;
    const {params} = ctx.request.body;
    let data = {result: {}};
    let reg = "";
    let param = (new Function("return " + params.optput))();
    let resultData = param.result;
    let number;
    for (let i = 0; i < resultData.length; i++) {
      let eq_id = -1;
      await ctx.model.Equip.findOne({where: {"number": resultData[i].epc}})
        .then(async res => {
          if (res) {
            eq_id = res.dataValues.id
          }
          ;
        })
        .catch(err => {
          console.log(err);
          // this.failed(data);
        });
      if (eq_id !== -1) {
        await ctx.model.User.findOne({where: {name}})
          .then(async res => {
            console.log(res.dataValues.number)
            if (res) {
              reg = new RegExp("^" + res.dataValues.number)
            }
            ;
          })
          .catch(err => {
            console.log(err);
          });
        if (!reg.test(resultData[i].epc)) {
          number = resultData[i].epc;
          let door_id = param.reader_name;
          let revsave = "";
          await ctx.model.Overflow.findOne({number}).then(cres => {
            revsave = cres.dataValues.number;
          })
            .catch(err => {
              console.log(err);
            });
          ;
          console.log(revsave);
          // if(!revsave.dataValues.number){
          await ctx.model.Overflow.create({
            name, number, door_id
          })
            .then(cres => {
              this.success(data);
            })
            .catch(err => {
              console.log(err);
            });
          // }

        } else {
          await ctx.model.ShowEquip.update({
            "status": 2
          }, {
            where: {equip_id: eq_id}
          })
            .then(async res => {
              console.log('success......')
              this.success(data);
            })
            .catch(err => {
              // this.failed(data);
            });
        }

      }
    }


  }

  async output() {
    const {ctx} = this;
    const name = ctx.request.name;
    const {params} = ctx.request.body;
    let data = {result: {}};
    let param = (new Function("return " + params.optput))();
    let resultData = param.result;
    for (let i = 0; i < resultData.length; i++) {
      let eq_id = -1;
      await ctx.model.Equip.findOne({where: {"number": resultData[i].epc}})
        .then(async res => {
          if (res) {
            eq_id = res.dataValues.id
          }
          ;
        })
        .catch(err => {
          console.log(err);
          // this.failed(data);
        });
      if (eq_id !== -1) {
        await ctx.model.ShowEquip.update({
          "status": 1
        }, {
          where: {equip_id: eq_id}
        })
          .then(async res => {
            this.success(data);
          })
          .catch(err => {
            // this.failed(data);
          });
      }
    }
  }

  async close() {
    const {ctx} = this;
    const name = ctx.request.name;
    // const { show_id, equip_id } = ctx.request.body;
    let data = {};
    await ctx.model.ShowEquip.findOne({where: {name, show_id, equip_id}})
      .then(res => {
        console.log(res)
        if (res) {
          data.msg = "演出已有该设备";
          this.failed(data);
        }
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async index() {
    const {ctx} = this;
    let status = 1;
    const name = ctx.request.name;
    const {show_id, equip_id} = ctx.request.body;
    let data = {};
    await ctx.model.ShowEquip.findOne({where: {name, show_id, equip_id}})
      .then(res => {
        console.log(res)
        if (res) {
          data.msg = "演出已有该设备";
          this.failed(data);
        }
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async check_search() {
    const {ctx} = this;
    const name = ctx.request.name;
    let data = {};
    const {show_id, status} = ctx.request.body;
    let where = (function get_where(name, show_id, status) {
      var arr = [];
      let where = {}
      if (typeof(name) != "undefined" && name != "") {
        arr["name"] = name
      }
      if (typeof(show_id) != "undefined" && show_id != "") {
        arr["show_id"] = show_id
      }
      if (typeof(status) != "undefined" && status != "") {
        arr["status"] = status
      }
      for (var ki in arr) {
        where[ki] = arr[ki];
      }
      return where;
    })(name, show_id, status);
    // where={ name };
    console.log(where)
    await ctx.model.ShowEquip.findAll({
      attributes: [ctx.model.col('u.number'), ctx.model.col('u.equip_name'), ctx.model.col('u.brand'), ctx.model.col('u.type'), 'status'],
      where: where,
      include: [{
        model: ctx.model.Equip,
        as: 'u',
        attributes: []
      }],
      raw: true
    })
      .then(async res => {
        let list = res.rows;
        data = {
          result: res
        };
        this.success(data);
      })
      .catch(err => {
        console.log("err")
        this.failed(data);
      });
  }

}

module.exports = ScanController;
