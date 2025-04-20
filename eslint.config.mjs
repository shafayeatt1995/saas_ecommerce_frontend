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
    "vue/no-multiple-template-root": ["off"],
    "vue/require-explicit-emits": ["off"],
    "vue/no-template-shadow": ["off"],
    "vue/require-default-prop": ["off"],
    "vue/no-v-html": ["off"],
  },
});
