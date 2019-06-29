import { smart } from "webpack-merge";
import baseConfig, { lessCommonLoaders } from "./webpack.config.base";

export default smart(baseConfig, {
  mode: "development",
  module: {
    rules: [
      {
        test: [/\.less$/, /\.css$/],
        use: [
          {
            loader: "style-loader"
          },
          ...lessCommonLoaders
        ]
      }
    ]
  }
});
