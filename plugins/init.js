export default defineNuxtPlugin(async () => {
  try {
    const route = useRoute();
    if (route.params?.storeid) {
      const { fetchStore } = useFrontend();
      const val = await fetchStore(route.params.storeid);
      if (!val) {
        throw createError({
          statusCode: 404,
          statusMessage: "Store not found",
        });
      }
    }
    const { fetchUser, authUser } = useAuth();
    const val = await fetchUser();
    if (val && authUser.value) {
      const { fetchStores, setSelectStore } = useStore();
      const fetchStatus = await fetchStores();
      if (fetchStatus) {
        setSelectStore();
      }
    }
  } catch (error) {
    console.error(error);
  }
});
