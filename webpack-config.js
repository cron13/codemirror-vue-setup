const ternConfig = {
  mode: 'development',
  entry: {
    "codemirror-tern.worker": './resources/js/plugins/codemirror/addon/tern/worker.js',
  },
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, './public/dist'),
    publicPath: '/public/dist/',
    filename: '[name].build.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: [/node_modules/, /monaco-vue-worker/]
    }, {
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    }]
  },
}