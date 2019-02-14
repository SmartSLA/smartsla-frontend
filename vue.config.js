const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? process.env.BASE_URL || "/" : "/",
  transpileDependencies: ["vue-openpaas-components"],
  configureWebpack: {
    resolve: {
      alias: {
        "%": path.resolve(__dirname, "tests"),
        "%utils": path.resolve(__dirname, "tests", "unit", "utils")
      }
    }
  }
};
