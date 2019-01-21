const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const distPath = path.join(__dirname, 'dist');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: distPath,
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'jSam',
      favicon: './assets/favicon.png',
      filename: 'index.html',
      template: './assets/index.html',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true
      }
    })
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: true,
          cacheDirectory: true
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader?outputPath=./images',
        include: path.resolve(__dirname, 'assets/images')
      }
    ]
  },

  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'assets'),
      Config: path.resolve(__dirname, 'src/config'),
      Services: path.resolve(__dirname, 'src/services'),
      Screens: path.resolve(__dirname, 'src/screens'),
      Shells: path.resolve(__dirname, 'src/screen-shells'),
      GlobalComponents: path.resolve(__dirname, 'src/components'),
      Utils: path.resolve(__dirname, 'src/utils'),
      Hooks: path.resolve(__dirname, 'src/hooks')
    }
  }
};
