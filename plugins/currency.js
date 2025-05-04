export default defineNuxtPlugin((nuxtApp) => {
  const { api } = useApi();
  nuxtApp.provide("taka", "৳");
  nuxtApp.provide("api", api);
});
