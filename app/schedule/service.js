
module.exports = {
    schedule: {
        interval: '1m', // 1 分钟间隔
        type: 'all', // 指定所有的 worker 都需要执行
        immediate: true,    //项目启动就执行一次定时任务
    },
    async task(ctx) {
        //const res = {"reader_name":"localreader/10.5.100.2","op_type:":"syncinventory","err_code":0,"err_string":"ok","result":[{"epc":"E2000017351002531180A037","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-61,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025316906B2A","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-55,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025315507855","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-57,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253171066CE","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-54,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025317006766","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-62,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253154078DE","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-51,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E200001735100253185059A9","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-53,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025313408EC6","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-59,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002292","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-47,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002266","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-56,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025316806BC2","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-63,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"100000201805260000002257","bank_data":"","antenna":4,"read_count":4,"protocol":5,"rssi":-53,"firstseen_timestamp":0,"lastseen_timestamp":0},{"epc":"E20000173510025318405A43","bank_data":"","antenna":4,"read_count":3,"protocol":5,"rssi":-55,"firstseen_timestamp":0,"lastseen_timestamp":0}]}
        /*const res = await ctx.curl('http://127.0.0.1:20085/moduleapi/syncinventory', {
            dataType: 'json',
            method: 'post',
            data: '{"antennas": [4], "timeout": 300}',
            contentType: "application/json; charset=utf-8",
        });
        console.log(res);*/
        /*for (let i = 0; i< res.result.length; i++){
            let eq_id = -1;
            await ctx.model.Equip.findOne( {where:{ "number": res.result[i].epc }})
                .then(async res => {
                    if(res){ eq_id = res.dataValues.id };
                })
                .catch(err => {
                    console.log(err);
                    // this.failed(data);
                });
            if(eq_id !== -1){
                await ctx.model.ShowEquip.update({
                    "status":4
                    },{
                    where: { equip_id: eq_id }
                })
                    .then(async res => {
                        console.log('success......')
                    })
                    .catch(err => {
                        // this.failed(data);
                    });
            }

        }*/

        //console.log( res.data );
    }
}