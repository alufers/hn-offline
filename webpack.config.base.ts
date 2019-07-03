import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { Plugin as IconFontPlugin } from "icon-font-loader";
import ServiceWorkerWebpackPlugin from "serviceworker-webpack-plugin";

const cssModulesNamePattern = "[sha1:hash:hex:4]";
export const cssCommonLoaders = [
  "css-modules-typescript-loader",
  {
    loader: "css-loader", // translates CSS into CommonJS,
    options: {
      modules: {
        localIdentName: cssModulesNamePattern
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

const context = path.resolve(__dirname, "src");

const config: webpack.Configuration = {
  mode: "production",
  entry: "./index.tsx",
  context,
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
        use: [
          {
            loader: "babel-loader",
            query: {
              plugins: [
                [
                  "@babel/transform-react-jsx",
                  {
                    pragma: "__Preact.h"
                  }
                ],
                [
                  "react-css-modules",
                  {
                    context,
                    generateScopedName: cssModulesNamePattern,
                    filetypes: {
                      ".less": {
                        syntax: "postcss-less"
                      }
                    }
                  }
                ],
                [
                  "auto-import", // we use this plugin insstead of webpack.ProvidePlugin to support better module concatenation
                  {
                    declarations: [{ default: "__Preact", path: "preact" }]
                  }
                ]
              ]
            }
          },

          { loader: "ts-loader" }
        ]
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
    // new BundleAnalyzerPlugin(),
    new IconFontPlugin({
      fontName: "icn",
      filename: "[name].[ext]?[sha1:hash:hex:5]",
      types: ["woff", "eot", "ttf", "svg"]
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, "src/service-worker/index.ts")
    })
  ]
};

export default config;
