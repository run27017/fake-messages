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
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
