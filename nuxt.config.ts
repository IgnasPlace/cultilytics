// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "cultilytics",
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    // "nuxt-maplibre",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-toast",
  ],
  plugins: ["~/plugins/maplibre.js"],
  ssr: false,
  nitro: {
    experimental: {
      database: true,
    },
    database: {
      myDB: {
        connector: "sqlite",
        options: { name: "db" },
      },
    },
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
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      maptiler_satellite_url: process.env.NUXT_MAPTILER_SATELLITE_URL,
    },
  },
});
