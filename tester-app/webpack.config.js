const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const DIST_PATH = path.join(__dirname, 'dist')
const ENTRY_PATH = path.join(__dirname, '/src/index.js')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: ENTRY_PATH,
  output: {
    path: DIST_PATH,
    filename: '[name].[hash].js'
  },
  devServer: {
    port: 3000,
    static: DIST_PATH
  },
  resolve: {
    extensions: ['*', '.js']
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html')
    }),
  ]
}
