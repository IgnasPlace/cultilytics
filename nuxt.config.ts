// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "cultilytics",
      htmlAttrs: {
        lang: "en",
      },
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-toast",
    "nuxt-file-storage",
    "nuxt-auth-utils",
    "nuxt-security",
  ],
  plugins: ["~/plugins/maplibre.js"],
  ssr: false,
  nitro: {
    experimental: {
      database: true,
    },
    // database: {
    //   myDB: {
    //     connector: "sqlite",
    //     options: { name: "db" },
    //   },
    // },
    // storage: {
    //   uploads: {
    //     driver: "fs",
    //     base: "./public/uploads",
    //   },
    // },
  },
  fileStorage: {
    mount: "./public/uploads",
  },
  tailwindcss: {
    config: {
      content: [
        "./components/**/*.{vue,js,jsx,mjs,ts,tsx}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./app.vue",
        "./plugins/**/*.{js,ts}",
      ],
      theme: {
        extend: {
          colors: { primary: "#4C763B", secondary: "#B95E82" },
          fontFamily: {
            poppins: ["Poppins", "sans-serif"],
          },
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      maptiler_satellite_url: process.env.NUXT_MAPTILER_SATELLITE_URL,
      map_lng: process.env.NUXT_MAP_LNG,
      map_lat: process.env.NUXT_MAP_LAT,
    },
    session: {
      password: "",
      name: "cltlytix",
      cookie: {
        maxAge: 60 * 60 * 24,
      },
    },
  },
});
