const { override, fixBabelImports } = require("customize-cra");

module.exports = {
  webpack: override(
    fixBabelImports("import", {
      libraryName: "@arco-design/web-react",
      libraryDirectory: "es",
      camel2DashComponentName: false,
      style: "css", // 样式按需加载,文档里面是true是无效的，需要改为css
    }),
  )
};
