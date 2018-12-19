var moment = require("moment");
const BaseController = require("./../core/base_controller");

class ShowEquipController extends BaseController {

  async selected_equips() {
    const {ctx} = this;
    const name = ctx.request.name;
    const {id} = ctx.query;
    let data = {};
    let status = 1
    await ctx.model.ShowEquip.findAll({
      where: {show_id: id, name}
    }).then(async res => {
      let list = res;
      data = {
        result: {
          equipList: []
        }
      };
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        const use_count = item.dataValues.use_count;
        const id = item.dataValues.equip_id;
        const rowId = item.dataValues.id;

        let rowData = {};

        await ctx.model.Equip.findById(id).then(eqres => {
          rowData.number = eqres.dataValues.number;
          rowData.equip_name = eqres.dataValues.equip_name;
          rowData.brand = eqres.dataValues.brand;
          rowData.type = eqres.dataValues.type;
          rowData.id = rowId;
          rowData.use_count = use_count;
        });
        data.result.equipList.push(rowData);
      }

      this.success(data);
    });
  }

  async selection_equips() {
    const {ctx} = this;
    const pageSize = ctx.query.pageSize - 0;
    const page = ctx.query.page - 0;
    const name = ctx.request.name;
    let searchForm = JSON.parse(ctx.query.search);

    Object.keys(searchForm).forEach(function (key) {
      if (searchForm[key] == "") {
        delete searchForm[key];
      }
    });

    let data = {};
    searchForm.name = name;
    searchForm.status = 0;
    await ctx.model.Equip.findAndCountAll({
      where: searchForm,
      offset: (page - 1) * pageSize,
      limit: pageSize
    })
      .then(async res => {
        let list = res.rows;
        data = {
          result: {
            equipList: [],
            total: res.count,
            current: page
          }
        };

        for (let index = 0; index < list.length; index++) {
          const v = list[index];
          let count = v.dataValues.count;
          const equip_id = v.dataValues.id;
          let dataValues = v.dataValues;

          data.result.equipList.push(dataValues);
        }

        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async selected_equip_add() {
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

    if (!data.msg) {
      let status = 1;
      await ctx.model.Equip.update(
        {status},
        {where: {'id': equip_id}})
        .then(res => {
          this.success(data);
        })
        .catch(err => {
          this.failed(data);
        });
      await ctx.model.ShowEquip.create({name, show_id, equip_id})
        .then(res => {
          this.success(data);
        })
        .catch(err => {
          this.failed(data);
        });
    }

  }

  async selected_equip_update() {
    const {ctx} = this;
    const name = ctx.request.name;
    const {id} = ctx.request.body;
    const add_count = ctx.request.body.use_count;
    let data = {};

    const equip = await ctx.model.ShowEquip.findById(id);

    const use_count = add_count + equip.dataValues.use_count;

    await ctx.model.ShowEquip.update(
      {use_count},
      {where: {name, id}})
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async selected_equip_delete() {
    const {ctx} = this;
    const name = ctx.request.name;
    const {id} = ctx.request.body;
    let data = {};
    let equip_id = 0;
    await ctx.model.ShowEquip.findOne({where: {name, id}})
      .then(res => {
        console.log(res.dataValues);
        equip_id = res.dataValues.equip_id;
      })
      .catch(err => {
        this.failed(data);
      });
    var status = 0;
    await ctx.model.Equip.update(
      {status},
      {where: {'id': equip_id}})
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
    await ctx.model.ShowEquip.destroy({where: {name, id}})
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async residue_equips() {
    const {ctx} = this;
    const name = ctx.request.name;
    let number = ctx.query.equipNum;

    let data = {};

    await ctx.model.Equip.findOne({
      where: {name, number}
    })
      .then(async res => {
        const equip_id = res.dataValues.id, count = res.dataValues.count;
        let residue = 0;

        await ctx.model.ShowEquip.sum("use_count", {
          where: {equip_id}
        }).then(num => {
          residue = count - num;
        });

        data = {result: {residue}};

        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  /*async greateCheck(){
        const { ctx } = this;
        const name = ctx.request.name;
        const { params} = ctx.request.body;
        let data = {
            result: {}
        };
        for(let i = 0; i<params.numbers.length; i++){
            let shows_id = params.id;
            let status = "未匹配";
            let equip_list_number = params.numbers[i];
            let equip_id = params.equip_id[i];

            await ctx.model.EquipCheck.create({
                shows_id,status,equip_list_number,equip_id
            })
                .then(cres => {
                    this.success(data);
                })
                .catch(err => {
                    this.failed(data);
                });
        }
    }
  async updateCheck(){
        const { ctx } = this;
        const name = ctx.request.name;
        const { numbers,equip_id } = ctx.request.body;
        let data = {
            result: {}
        };

        let status = "已匹配";
        let equip_list_number = numbers;
        await ctx.model.update(
            {status},
            {where:{equip_list_number}
        })
        .then(cres => {
          this.success(data);
        })
        .catch(err => {
          this.failed(data);
        });
  }*/

}

module.exports = ShowEquipController;
