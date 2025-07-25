import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME,
      BASE_URL: process.env.BASE_URL,
      API_URL: process.env.API_URL,
      API2_URL: process.env.API2_URL,
    },
  },
  modules: ["@nuxt/eslint", "@nuxt/fonts", "shadcn-nuxt"],
  css: ["@/assets/css/tailwind.css"],
  shadcn: { prefix: "", componentDir: "./components/ui" },
  vite: {
    plugins: [tailwindcss()],
  },
});
