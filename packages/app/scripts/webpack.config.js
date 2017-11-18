const ExtractTextPlugin = require("extract-text-webpack-plugin");

/* global __dirname */
const path = require("path");

module.exports = {

  context: path.resolve(__dirname, "../src"),

  entry: {
    index: "../index.js"
  },

  externals: {
    mithril: "m"
  },

  output: {
    path: path.resolve(__dirname, "../dist/"),
    filename: "js/[name].js"
  },

  module: {
    rules: [
      {
        // For more options see: https://philipwalton.com/articles/deploying-es2015-code-in-production-today/
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["env", {
                modules: false,
                useBuiltIns: true,
                targets: {
                  browsers: [
                    "> 1%",
                    "last 2 versions",
                    "Firefox ESR",
                  ],
                }
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: "css/app.css"
    }),
  ],

  devtool: "source-map"

};
