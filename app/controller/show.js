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

    async searchShow() {
        const { ctx } = this;
        const name = ctx.request.name;
        let data = {};
        console.log(123)
        await ctx.model.Show.findAll({
            where: { name }
        })
            .then(res => {
              data.result = res;
                this.success(data);
            })
            .catch(err => {
                this.failed(data);
            });
    }
}

module.exports = ShowController;
