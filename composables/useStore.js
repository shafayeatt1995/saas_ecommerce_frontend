import { useUtils } from "./useUtils";

export default function () {
  const { api } = useApi();
  const select = useState("select", () => null);
  const stores = useState("stores", () => []);
  const loading = useState("loading", () => false);
  const fetchStores = async () => {
    try {
      loading.value = true;
      const { items } = await api.get("/user/store");
      stores.value = items;
      return items;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };
  const createStore = async (data) => {
    try {
      const store = await api.post("/user/store", data);
      const fetch = await fetchStores();
      if (fetch) {
        const { setCookie } = useUtils();
        select.value =
          stores.value.find((s) => s._id === store._id)?._id ||
          stores.value[0]?._id ||
          null;
        setCookie("storeID", select.value, {
          expires: 30,
          path: "/",
        });
      }
      return store;
    } catch (error) {
      console.error(error);
      return error;
    }
  };
  const setSelectStore = (val) => {
    if (val) {
      select.value = val;
    } else {
      if (select.value) return;
      const { getCookie } = useUtils();
      const getSelectStore = getCookie("storeID");
      if (getSelectStore) {
        const findStore = stores.value.some((s) => s._id === getSelectStore);
        if (findStore) {
          select.value = getSelectStore;
        } else {
          select.value = stores.value[0]?._id || null;
        }
      } else {
        select.value = stores.value[0]?._id || null;
      }
    }
    const { setCookie } = useUtils();
    setCookie("storeID", select.value, {
      expires: 30,
      path: "/",
    });
  };
  const selectStore = stores.value.find((s) => s._id === select.value) || null;
  const storeID = selectStore?._id || null;
  return {
    fetchStores,
    createStore,
    stores,
    loading,
    selectStore,
    setSelectStore,
    select,
    storeID,
  };
}
