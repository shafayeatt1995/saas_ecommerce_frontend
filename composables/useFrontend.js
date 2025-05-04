export default function () {
  const { api } = useApi();
  const store = useState("frontendStore", () => null);
  const marketing = useState("frontendMarketing", () => null);
  const fetchStore = async (id) => {
    try {
      if (store.value) return store.value;
      const { data } = await useAsyncData(`store-${id}`, () =>
        api.get(`/store/fetch`, { id })
      );
      store.value = data.value.store;
      marketing.value = data.value.marketing;
      return store.value;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  return {
    fetchStore,
    store,
    marketing,
  };
}
