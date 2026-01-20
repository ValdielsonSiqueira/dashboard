const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

const path = require("path");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "FIAP",
    projectName: "dashboard",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  // Remove valid rules that match CSS to avoid double-loading (css-loader conflict)
  defaultConfig.module.rules = defaultConfig.module.rules.filter((rule) => {
    return !rule.test || !rule.test.toString().includes("css");
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    devServer: {
      port: 8083,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    output: {
      publicPath: "//localhost:8083/",
    },
    externals: ["react", "react-dom", "react-dom/client", "@FIAP/util"],
    module: {
      rules: [
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, "src"),
          use: [
            require.resolve("style-loader"),
            require.resolve("css-loader"),
            {
              loader: require.resolve("postcss-loader"),
            },
          ],
        },
        {
          test: /\.css$/i,
          exclude: path.resolve(__dirname, "src"),
          use: [require.resolve("style-loader"), require.resolve("css-loader")],
        },
        {
          test: /\.svg$/i,
          type: "asset/resource",
        },
      ],
    },
  });
};
