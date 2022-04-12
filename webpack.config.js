/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    // 设置代理
    proxy: {
      // 将本地 /api2/xxx 代理到 localhost:6666/xxx，通常用这个，/api2仅作为代理转发的标识
      "/api": {
        target: "http://103.118.40.123:9999",
        changeOrigin: true,
        pathRewrite: {
          "/api": "",
        },
      },
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "model",
    }),
  ],
};
