const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  target: 'web',
  entry: [
    '@babel/polyfill',
    './javascripts/main.js'
  ],
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.ya?ml/,
        loader: 'js-yaml-loader'
      },
      {
        test: /\.md$/,
        loader: 'vue-loader!vue-md-loader'
      },
      {
        test: /\.(ttf|woff|woff2|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '../assets',
              publicPath: '/assets'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'javascripts')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
