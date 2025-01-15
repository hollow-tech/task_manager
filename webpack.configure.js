const path = require("path");

module.exports = {
  entry: "./src/index.tsx", // Entry point of your application
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    // Add .ts and .tsx as resolvable extensions.
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match .ts and .tsx files
        use: "ts-loader", // Use ts-loader for TypeScript files
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map", // Optional: Useful for debugging
  mode: "development", // Change to "production" for optimized builds
};
