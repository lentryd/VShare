module.exports = {
  pwa: {
    name: "VShare",
    themeColor: "#0A0A0F",
    msTileColor: "#0A0A0F",
    manifestOptions: {
      background_color: "#0A0A0F",
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      navigateFallback: "index.html",
      runtimeCaching: [
        {
          urlPattern: /\/__\//,
          handler: "NetworkOnly",
        },
      ],
    },
  },
};
