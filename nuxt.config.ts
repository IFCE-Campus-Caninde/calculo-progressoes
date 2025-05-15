import tailwindcss from "@tailwindcss/vite";
import Aura from "@primeuix/themes/aura";
import ptBR from "primelocale/pt-BR.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    [
      "@primevue/nuxt-module",
      {
        options: {
          theme: {
            preset: Aura,
            options: {
              darkModeSelector: ".dark",
            },
          },
          locale: ptBR["pt-BR"],
          ripple: true,
        },
      },
    ],
  ],
  app: {
    head: {
      bodyAttrs: {
        class: "bg-slate-200 dark:bg-slate-900",
      },
    },
  },
});
