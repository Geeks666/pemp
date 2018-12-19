const BaseController = require("./../core/base_controller");

class EquipController extends BaseController {
    async check_search() {
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
        await ctx.model.Equip.findAndCountAll({
            where: searchForm,
            offset: (page - 1) * pageSize,
            limit: pageSize
        })
            .then(res => {
                let list = res.rows;
                data = {
                    result: {
                        equipList: [],
                        total: res.count,
                        current: page
                    }
                };
                list.forEach(v => {
                    data.result.equipList.push(v.dataValues);
                });

                this.success(data);
            })
            .catch(err => {
                console.log(err);
                this.failed(data);
            });
    }
    async search() {
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
        await ctx.model.Equip.findAndCountAll({
            where: searchForm,
            offset: (page - 1) * pageSize,
            limit: pageSize
        })
            .then(res => {
                let list = res.rows;
                data = {
                    result: {
                        equipList: [],
                        total: res.count,
                        current: page
                    }
                };
                list.forEach(v => {
                    data.result.equipList.push(v.dataValues);
                });

                this.success(data);
            })
            .catch(err => {
                console.log(err);
                this.failed(data);
            });
    }

    async add() {
        const {ctx} = this;
        const name = ctx.request.name;
        const {equip_name, brand, type, number, remark,} = ctx.request.body;
        let data = {};
        await ctx.model.Equip.findOne({
            where: {equip_name, brand, type, number}
        })
            .then(async res => {
                if (!res) {
                    await ctx.model.Equip.create({
                        name,
                        equip_name,
                        brand,
                        type,
                        number,
                        remark
                    })
                        .then(async cres => {
                            this.success(data);
                        })
                        .catch(err => {
                            this.failed(data);
                        });
                } else {
                    data = {
                        msg: "该装备已存在"
                    };
                    this.failed(data);
                }
            })
            .catch(err => {
                this.failed(data);
            });
    }

    async update() {
        const {ctx} = this;
        const name = ctx.request.name;
        const {id, equip_name, brand, type, count, remark} = ctx.request.body;
        let data = {};

        let getEquipData = await ctx.model.Equip.findById(id);

        if (
            equip_name == getEquipData.equip_name &&
            brand == getEquipData.brand &&
            type == getEquipData.type
        ) {
            await ctx.model.Equip.update({count, remark}, {where: {id, name}})
                .then(res => {
                    this.success(data);
                })
                .catch(err => {
                    this.failed(data);
                });
        } else {
            await ctx.model.Equip.findOne({
                where: {name, equip_name, brand, type}
            }).then(async res => {
                if (!res) {
                    await ctx.model.Equip.update({count, remark}, {where: {id, name}})
                        .then(res => {
                            this.success(data);
                        })
                        .catch(err => {
                            this.failed(data);
                        });
                } else {
                    data = {msg: "该装备已存在"};
                    this.failed(data);
                }
            });
        }
    }

    async delete() {
        const {ctx} = this;
        const name = ctx.request.name;
        const {id} = ctx.request.body;
        let data = {};

        await ctx.model.Equip.destroy({
            where: {name, id}
        })
            .then(res => {
                this.success(data);
            })
            .catch(err => {
                this.failed(data);
            });
    }
}

module.exports = EquipController;
