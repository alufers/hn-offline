import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import BabelMinifyPlugin from "babel-minify-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

console.log(process.env.NODE_ENV);

const config: webpack.Configuration = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      react: "preact-compat",
      "react-dom": "preact-compat"
    }
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development"
            }
          },
          "css-modules-typescript-loader",
          {
            loader: "css-loader", // translates CSS into CommonJS,
            options: {
              modules: {
                localIdentName: "[sha1:hash:hex:4]"
              }
            }
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          { loader: "url-loader" },
          {
            loader: "image-webpack-loader",
            options: {}
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [new BabelMinifyPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "HN Offline"
    }),
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};

export default config;
