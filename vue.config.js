module.exports = {
  pwa: {
    name: "VShare",
    themeColor: "#1c1b1f",
    msTileColor: "#1c1b1f",
    iconPaths: {
      maskIcon: null,
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      msTileImage: null,
      appleTouchIcon: "img/icons/apple-touch-icon.png",
    },

    manifestOptions: {
      display: "standalone",
      orientation: "portrait",
      background_color: "#1c1b1f",
      icons: [
        {
          src: "./img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },

    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js",
      swDest: "service-worker.js",
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/variables.scss";`,
      },
    },
  },
};
