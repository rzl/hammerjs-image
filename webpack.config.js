module.exports = {
  devtool: 'eval-source-map',
  entry:  __dirname + "/app/main.js",
  externals: {
    'hammerjs': {
      commonjs: 'hammerjs',
      commonjs2: 'hammerjs',
      amd: 'hammerjs',
      root: 'Hammer'
    }
  },
  output: {
    path: __dirname + "/public",
    filename: "bundle.js",
    library: {
      root: "hammerjsImage",
      amd: "hammerjs-image",
      commonjs: "hammerjs-image"
    },
    libraryTarget: "umd"
  },
  devServer: {
    contentBase: "./public",
    historyApiFallback: true,
    inline: true
  } 
}