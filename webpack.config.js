const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: { main: "./src/index.js" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "S3LambdaUtil.js",
    library: 'S3LambdaUtil',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  target: 'node',
  externals: [{ "aws-sdk": "commonjs aws-sdk" }],
  optimization: {
    minimize: false,
  },
  devtool: 'inline-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { targets: { node: '12' }, useBuiltIns: 'usage', corejs: 3 }
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist']
    })
  ]
}