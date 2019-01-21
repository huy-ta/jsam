const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');

const distPath = path.join(__dirname, 'dist');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    }),
    new MiniCSSExtractPlugin({
      fileName: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: distPath,
    historyApiFallback: true,
    inline: true,

    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
        changeOrigin: true
      }
    }
  }
});
