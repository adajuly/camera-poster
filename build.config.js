const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './packages/index.js',
  output: {
    path: path.resolve(__dirname, './dist/'),
		filename: 'camera-poster.js',
		library: 'CameraPoster',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': 'examples',
      '~': 'packages'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  mode: "production",
  plugins: [
    new VueLoaderPlugin(),
    // 依赖分析
    // new BundleAnalyzerPlugin()
  ]
}
