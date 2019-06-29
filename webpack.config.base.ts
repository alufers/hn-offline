import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { Plugin as IconFontPlugin } from "icon-font-loader";

export const cssCommonLoaders = [
  "css-modules-typescript-loader",
  {
    loader: "css-loader", // translates CSS into CommonJS,
    options: {
      modules: {
        localIdentName: "[sha1:hash:hex:4]"
      }
    }
  },
  "icon-font-loader"
];

export const lessCommonLoaders = [
  ...cssCommonLoaders,
  {
    loader: "less-loader" // compiles Less to CSS
  }
];

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
  optimization: {
    splitChunks: {
      chunks: "initial"
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
        test: [/\.less$/, /\.css$/],
        use: [...lessCommonLoaders]
      },
      {
        test: /\.svg$/,
        use: [{ loader: "url-loader" }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "HN Offline"
    }),
    new BundleAnalyzerPlugin(),
    new IconFontPlugin({
      types: ["woff", "eot", "ttf", "svg"]
    })
  ]
};

export default config;
