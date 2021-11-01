module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '高睿云服务'
    }
  },
  pluginOptions: {
    pwa: {
      iconPaths: {
        favicon32: './favicon.ico',
        favicon16: './favicon.ico',
        appleTouchIcon: './favicon.ico',
        maskIcon: './favicon.ico',
        msTileImage: './favicon.ico'
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        // 引入全局 scss 文件
        prependData: `@import "@/assets/scss/_variable.scss";`
      }
    }
  },
  devServer: {
    port: 8080,
    open: true
  }
}
