const webpack = require("webpack")
module.exports = {
  lintOnSave: false,
  devServer: {
    port: 12323,    
  },
  configureWebpack: config => {
    return {
      plugins: [
        new webpack.ProvidePlugin({
          ktools: ["@/assets/js/utils.js"]
        })
      ]
    }
  }
}
