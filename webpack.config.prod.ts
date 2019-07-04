import { smart } from "webpack-merge";
import baseConfig, { lessCommonLoaders } from "./webpack.config.base";
import BabelMinifyPlugin from "babel-minify-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

export default smart(baseConfig, {
  mode: "production",
  optimization: {
    minimizer: [
      new BabelMinifyPlugin({}) as any,
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: "image-webpack-loader",
            options: {}
          }
        ]
      },
      {
        test: [/\.less$/, /\.css$/],
        use: [
          "ignore-loader",
          {
            loader: MiniCssExtractPlugin.loader
          },
          ...lessCommonLoaders
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css"
    }),
    new CleanWebpackPlugin()
  ]
});
