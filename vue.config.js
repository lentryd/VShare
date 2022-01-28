module.exports = {
  pwa: {
    name: "VShare",
    themeColor: "#0A0A0F",
    msTileColor: "#0A0A0F",
    iconPaths: {
      maskIcon: null,
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      msTileImage: null,
      appleTouchIcon: "img/icons/apple-touch-icon.png",
    },

    manifestOptions: {
      display: "standalone",
      background_color: "#0A0A0F",
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

    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
};
