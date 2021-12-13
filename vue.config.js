const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  pages: {
    index: {
      entry: "examples/main.js", // 入口
      template: "public/index.html", // 模板
      filename: "index.html" // 输出文件
    }
  },
  configureWebpack: {
    //plugins: [new BundleAnalyzerPlugin()]
  },
  // 扩展 webpack 配置
  chainWebpack: config => {
    config.resolve.alias.set("@", path.resolve("examples")).set("~", path.resolve("packages"));

    config.module
      .rule("js")
      .include.add(/packages/)
      .end()
      .include.add(/examples/)
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap(options => {
        // 修改它的选项...
        return options;
      });
  }
};
