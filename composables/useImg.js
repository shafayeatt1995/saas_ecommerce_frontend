export default function () {
  const { api } = useApi();
  const page = useState("page", () => 1);
  const perPage = useState("perPage", () => 20);
  const blocked = useState("blocked", () => false);
  const images = useState("images", () => []);
  const total = useState("total", () => 0);
  const imageLoading = useState("imageLoading", () => false);
  const deleteLoading = useState("deleteLoading", () => false);
  const loaded = useState("loaded", () => false);
  const search = useState("search", () => "");
  const fetchImages = async () => {
    try {
      if (loaded.value) return;
      if (blocked.value) return;
      imageLoading.value = true;
      const { items, totalImages } = await api.get2("/user/image", {
        page: page.value,
        perPage: perPage.value,
        search: search.value,
      });
      images.value = items;
      total.value = totalImages;
      loaded.value = true;
    } catch (err) {
      console.error(err);
    } finally {
      imageLoading.value = false;
    }
  };
  const deleteImages = async (keyList) => {
    try {
      deleteLoading.value = true;
      await api.post2("/user/image/delete", { keyList });
      resetImages();
    } catch (error) {
      console.error(error);
    } finally {
      deleteLoading.value = false;
    }
  };
  const resetImages = () => {
    images.value = [];
    total.value = 0;
    page.value = 1;
    loaded.value = false;
    fetchImages();
  };
  const loadPage = (p = 1) => {
    images.value = [];
    page.value = p;
    loaded.value = false;
    fetchImages();
  };
  return {
    fetchImages,
    images,
    total,
    imageLoading,
    page,
    perPage,
    resetImages,
    loadPage,
    deleteImages,
    search,
    deleteLoading,
  };
}
