const webpack = require('webpack')

const plugins = [
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
]

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    plugins
  },

  devServer: {
    port: '9000',
    proxy: {
      '/cqb-base-mgr': {
        target: process.env.VUE_APP_PROXY_TARGET,
        ws: false,
        changeOrigin: true
      }
    }
  }
}
