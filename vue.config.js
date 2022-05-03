const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? process.env.BASE_URL || "/" : "/",
  transpileDependencies: ["vue-openpaas-components"],
  configureWebpack: {
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 100000,
        maxSize: 250000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              return `${packageName.replace("@", "")}`;
            }
          }
        }
      }
    },
    plugins: [new CompressionPlugin()],
    resolve: {
      alias: {
        "%": path.resolve(__dirname, "tests"),
        "%utils": path.resolve(__dirname, "tests", "unit", "utils")
      }
    }
  },
  devServer: {
    disableHostCheck: true
  }
};
