// vue.config.js
module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      '^/api': {
        target: 'http://app:3000',
        ws: true,
        changeOrigin: false,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
