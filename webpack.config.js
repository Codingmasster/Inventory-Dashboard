// webpack.config.js

const path = require("path");

module.exports = {
  entry: "./src/index.js", // Your entry point
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/", // Base URL for all assets
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this loader to all .js files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Use Babel for JavaScript files
        },
      },
      {
        test: /\.scss$/, // Apply this loader to all .scss files
        use: [
          "style-loader", // Inject styles into the DOM
          "css-loader", // Turns CSS into CommonJS
          "sass-loader", // Compiles Sass to CSS
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // Resolve these extensions
  },
  devServer: {
    historyApiFallback: true, // Fallback to index.html for SPA behavior
  },
};
