const webpack = require("webpack")
module.exports = {
  lintOnSave: false,
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
