var moment = require("moment");
const BaseController = require("./../core/base_controller");

class BoxController extends BaseController {
    async msg() {
        const {ctx} = this;
        const data = {
            result: {}
        };
        await ctx.model.Show.findAndCountAll({

        }).then(res => {
            data.result = res.rows;
            this.success(data);
        }).catch(err => {
            this.failed(data);
        });
    }

    async equipName() {
        const {ctx} = this;
        const {show_id} = ctx.query;
        const data = {
            result: {}
        };
        await ctx.model.Equip.findAll({
            include: {
                model: this.app.model.ShowEquip,
                required: true,
                where: {
                    show_id: show_id
                },
            },

        }).then(res => {
            data.result = res;
            this.success(data);
        }).catch(err => {
            this.failed(data);
        });
    }

    async equipBrand() {
        const {ctx} = this;
        const { show_id, equip_name } = ctx.query;
        const data = {
            result: {}
        };
        await ctx.model.Equip.findAll({
            include: {
                model: this.app.model.ShowEquip,
                required: true,
                where: {
                    show_id: show_id,
                },
            },
            where: {
                equip_name: equip_name,
            },
        }).then(res => {
            data.result = res;
            this.success(data);
        }).catch(err => {
            this.failed(data);
        });
    }

    async equipType() {
        const {ctx} = this;
        const { show_id, equip_name, brand,} = ctx.query;

        const data = {
            result: {}
        };
        await ctx.model.Equip.findAll({
            include: {
                model: this.app.model.ShowEquip,
                required: false,
                where: {
                    show_id: show_id,
                },
            },
            where: {
                equip_name: equip_name,
                brand: brand
            },
        }).then(res => {
            data.result = res;
            this.success(data);
        }).catch(err => {
            this.failed(data);
        });
    }

    async search() {
        const {ctx} = this;
        const {box_number, equip_name, type,} = ctx.request.body;

        function get_where(box_number, equip_name, type, equip_id) {
            var arr = [];
            let where = {}
            if (box_number && box_number != "") {
                arr["box_number"] = (box_number)
            }
            if (equip_name && equip_name != "") {
                arr["equip_name"] = (equip_name)
            }
            if (type && type != "") {
                arr["type"] = (type)
            }
            for (var ki in arr) {
                where[ki] = arr[ki];
            }
            return where;
        };
        let data = {};

        let where = get_where(box_number, equip_name, type);
        console.log(where);
        await ctx.model.Boxs.findAndCountAll({
            where: where
        }).then(res => {
            data = {
                result: {
                    showList: res.rows,
                    total: res.count,
                }
            };
            this.success(data);
        }).catch(err => {
            this.failed(data);
        });
    }

    async check_equip() {
        const {ctx} = this;
        const {shows_id} = ctx.request.body;

        function get_where(shows_id) {
            var arr = [];
            let where = {}
            if (shows_id && shows_id != "") {
                arr["shows_id"] = (shows_id)
            }
            for (var ki in arr) {
                where[ki] = arr[ki];
            }
            return where;
        };
        let data = {};

        let where = get_where(shows_id);
        await ctx.model.EquipCheck.findAndCountAll({
            where: where
        }).then(res => {
            data = {
                result: {
                    showList: res.rows,
                    total: res.count,
                }
            };
            this.success(data);
        }).catch(err => {
            this.failed(data);
        });
    }

    async create() {
        const {ctx} = this;
        console.log(123)
        const name = ctx.request.name;
        const { equip_list_number, box_number,show_id } = ctx.request.body;
        let data = {};
        data = {
            result: {}
        };
        /*await ctx.model.Boxs.findOne({
            where:{equip_list_number,box_number}
        })
            .then(cres => {
                this.success(data);
            })
            .catch(err => {
                this.failed(data);
            });*/
        await ctx.model.Boxs.create({
            show_id,
            equip_list_number,
            box_number,
        })
            .then(cres => {
                this.success(data);
            })
            .catch(err => {
                this.failed(data);
            });
    }

    async delete() {
        const {ctx} = this;
        //const name = ctx.request.name;
        const {id} = ctx.request.body;
        let data = {};

        await ctx.model.Boxs.destroy({
            where: {id}
        })
            .then(res => {
                this.success(data);
            })
            .catch(err => {
                this.failed(data);
            });
    }

    async update() {
        const {ctx} = this;
        const name = ctx.request.name;
        const {id, show_name, data_date} = ctx.request.body;
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
                where: {name, show_name, data_date: fdata_date}
            }).then(async res => {
                if (!res) {
                    await ctx.model.Show.update(
                        {show_name, data_date: fdata_date},
                        {where: {id, name}}
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
                    data = {msg: "该演出已存在"};
                    this.failed(data);
                }
            });
        }
    }

    async check_boxs() {
        const {ctx} = this;
        //const { brand, type } = ctx.query;
        let data = {};
        await ctx.model.Boxs.findAndCountAll().then(async res => {
            console.log(res.dataValues);
            data = {
                result: res.rows,
            };
            this.success(data);
        });
    }

    async msg_menu() {
        const {ctx} = this;
        const {brand, type} = ctx.query;
        let data = {};

        function get_where(brand, type) {
            var arr = [];
            let where = {}
            if (typeof(brand) != "undefined") {
                arr["brand"] = brand
            }
            if (typeof(type) != "undefined") {
                arr["type"] = type
            }
            for (var ki in arr) {
                where[ki] = arr[ki];
            }
            return where;
        };
        await ctx.model.Equip.findAndCountAll({
            where: get_where(brand, type)
        }).then(async res => {
            console.log(res.dataValues);
            data = {
                result: res.rows,
            };

            this.success(data);
        });
    }

}

module.exports = BoxController;
