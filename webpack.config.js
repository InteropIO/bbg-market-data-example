const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    inline: true,
    port: 3000
  },
  entry: {
    babel_polyfill: '@babel/polyfill',
    bundle: path.join(__dirname, '/src/scripts/index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js', '.ts']
  },
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/,
        loaders: ['babel-loader'],
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg)$/,
        use: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html.ejs'
    }),
  ]
}
