const path = require("path");

module.exports = {
  mode: "production",
  entry: "./assets/src/js/index.js",
  output: {
    filename: "main.bundle.js",
    path: path.resolve(__dirname, "assets/dist/js"),
  },
  // Use WordPress's bundled jQuery rather than shipping our own copy
  externals: {
    jquery: "jQuery",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
};
