import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  languageOptions: {
    globals: {
      defineNuxtConfig: "readonly",
    },
  },
  rules: {
    "vue/attribute-hyphenation": ["off"],
    "vue/html-self-closing": ["off"],
  },
});
