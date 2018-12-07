"use strict";

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1538289771987_1855";

  // add your config here
  config.middleware = ['verifyUser'];

  config.cluster = {
    listen: {
      port: 7002//,
      // hostname: "127.0.0.1"
    }
  };

  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: null,
    database: 'pemp',
    define: {
      underscored: true
    },
    timezone: "+08:00"
  };

  config.security = {
    csrf: {
      enable: false,
      credentials: true,
      headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
      domainWhiteList: ['http://localhost:63344']
    },
  };
    config.cors = {
        credentials: true,
        origin:'http://localhost:63344',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    };
  /*config.alinode = {
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: '76501',
    secret: '287e9382604c55e5c8ba36b9dd5edc4d691e524a',
    logdir: '/tmp/nodejs-logs/',
    error_log: [],
    agentidMode: ''
  };*/

  return config;
};
