export default defineNuxtPlugin(async () => {
  const { fetchUser, authUser } = useAuth();
  const val = await fetchUser();
  if (val && authUser.value) {
    const { fetchStores, setSelectStore } = useStore();
    const fetchStatus = await fetchStores();
    if (fetchStatus) {
      setSelectStore();
    }
  }
});
