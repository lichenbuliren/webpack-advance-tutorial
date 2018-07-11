const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 抽取 CSS 到独立的 CSS 文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const srcPath = path.resolve(__dirname, 'src')

module.exports = {
  entry: {
    entry: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.jsx?/,
      include: [
        srcPath
      ],
      use: 'babel-loader'
    }, {
      test: /\.css/,
      include: [
        srcPath
      ],
      // css-loader 负责处理 `@import` 和 `url()` 等引用外部文件声明
      // style-loader 会将 css-loader 解析的结果转变为 js 代码，在运行时动态插入 style 标签来让 CSS 生效
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader']
      })
    }, {
      test: /\.(png|jpg|gif|svg|jpeg)$/,
      use: [{
        loader: 'file-loader',
        options: {}
      }]
    }]
  },
  // 代码模块解析路径配置
  resolve: {
    modules: [
      'node_modules',
      srcPath
    ],
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new ExtractTextPlugin('index.css'),
    new UglifyPlugin()
  ]
}
