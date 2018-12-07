var moment = require("moment");
const BaseController = require("./../core/base_controller");

class ShowController extends BaseController {
  async search() {
    const { ctx } = this;
    const pageSize = ctx.query.pageSize - 0;
    const page = ctx.query.page - 0;
    const name = ctx.request.name;
    let searchForm = JSON.parse(ctx.query.search);
    if (searchForm.data_date != "") {
      searchForm.data_date = moment(searchForm.data_date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    Object.keys(searchForm).forEach(function(key) {
      if (searchForm[key] == "") {
        delete searchForm[key];
      }
    });

    let data = {};
    searchForm.name = name;
    await ctx.model.Show.findAndCountAll({
      where: searchForm,
      offset: (page - 1) * pageSize,
      limit: pageSize
    })
      .then(res => {
        let list = res.rows;
        data = {
          result: {
            showList: [],
            total: res.count,
            current: page
          }
        };
        list.forEach(v => {
          v.dataValues.data_date = moment(v.dataValues.data_date).format(
            "YYYY-MM-DD"
          );
          data.result.showList.push(v.dataValues);
        });

        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async add() {
    const { ctx } = this;
    const name = ctx.request.name;
    const { show_name, data_date } = ctx.request.body;
    let data = {};
    await ctx.model.Show.findOne({ where: { name, show_name, data_date } })
      .then(async res => {
        if (!res) {
          await ctx.model.Show.create({
            name,
            show_name,
            data_date: moment(data_date).format("YYYY-MM-DD HH:mm:ss")
          })
            .then(cres => {
              this.success(data);
            })
            .catch(err => {
              this.failed(data);
            });
        } else {
          data = { msg: "该演出已存在" };
          this.failed(data);
        }
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async delete() {
    const { ctx } = this;
    const name = ctx.request.name;
    const { id } = ctx.request.body;
    let data = {};

    await ctx.model.Show.destroy({
      where: { name, id }
    })
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async update() {
    const { ctx } = this;
    const name = ctx.request.name;
    const { id, show_name, data_date } = ctx.request.body;
    let data = {};
    let fdata_date = moment(data_date).format("YYYY-MM-DD HH:mm:ss");

    let getShowData = await ctx.model.Show.findById(id);

    if (
      show_name == getShowData.show_name &&
      fdata_date == getShowData.data_date
    ) {
      this.success(data);
    } else {
      await ctx.model.Show.findOne({
        where: { name, show_name, data_date: fdata_date }
      }).then(async res => {
        if (!res) {
          await ctx.model.Show.update(
            { show_name, data_date: fdata_date },
            { where: { id, name } }
          )
            .then(res => {
              data = {
                result: {
                  id,
                  show_name,
                  data_date: moment(data_date).format("YYYY-MM-DD")
                }
              };
              this.success(data);
            })
            .catch(err => {
              this.failed(data);
            });
        } else {
          data = { msg: "该演出已存在" };
          this.failed(data);
        }
      });
    }
  }

  async selected_equips() {
    const { ctx } = this;
    const name = ctx.request.name;
    const { id } = ctx.query;
    let data = {};

    await ctx.model.ShowEquip.findAll({
      where: { show_id: id, name }
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
    const { ctx } = this;
    const pageSize = ctx.query.pageSize - 0;
    const page = ctx.query.page - 0;
    const name = ctx.request.name;
    let searchForm = JSON.parse(ctx.query.search);

    Object.keys(searchForm).forEach(function(key) {
      if (searchForm[key] == "") {
        delete searchForm[key];
      }
    });

    let data = {};
    searchForm.name = name;
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

          await ctx.model.ShowEquip.sum("use_count", {
            where: { equip_id }
          }).then(num => {
            if (!isNaN(num)) {
              v.dataValues.count = count - num;
            }
            v.dataValues.use_count = 0;
          });

          data.result.equipList.push(dataValues);
        }

        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async selected_equip_add() {
    const { ctx } = this;
    const name = ctx.request.name;
    const { show_id, equip_id, use_count } = ctx.request.body;
    let data = {};

    await ctx.model.ShowEquip.create({ name, show_id, equip_id, use_count })
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async selected_equip_update() {
    const { ctx } = this;
    const name = ctx.request.name;
    const { id } = ctx.request.body;
    const add_count = ctx.request.body.use_count;
    let data = {};

    const equip = await ctx.model.ShowEquip.findById(id);

    const use_count = add_count + equip.dataValues.use_count;

    await ctx.model.ShowEquip.update(
      { use_count },
      { where: {name, id }})
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async selected_equip_delete(){
    const { ctx } = this;
    const name = ctx.request.name;
    const { id } = ctx.request.body;
    let data = {};

    await ctx.model.ShowEquip.destroy({ where: { name, id } })
      .then(res => {
        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }

  async residue_equips(){
    const { ctx } = this;
    const name = ctx.request.name;
    let number = ctx.query.equipNum;

    let data = {};

    await ctx.model.Equip.findOne({
      where: { name, number }
    })
      .then(async res => {
        const equip_id = res.dataValues.id, count = res.dataValues.count;
        let residue = 0;

        await ctx.model.ShowEquip.sum("use_count", {
          where: { equip_id }
        }).then(num => {
          residue = count - num;
        });

        data = { result: { residue } };

        this.success(data);
      })
      .catch(err => {
        this.failed(data);
      });
  }
  async greateCheck(){
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
            /*await ctx.model.EquipCheck.findOne({
                where:{shows_id,equip_list_number,equip_id}
            })
                .then(cres => {
                this.success(data);
            })
                .catch(err => {
                    this.failed(data);
                });*/
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
  }
}

module.exports = ShowController;
