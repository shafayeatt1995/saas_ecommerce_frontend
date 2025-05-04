<template>
  <Head> </Head>
  <Store>
    <section class="container mx-auto px-4 lg:px-0 py-10">
      <div class="mb-5 overflow-x-auto">
        <div
          class="flex gap-5 min-w-max scrollbar-thin scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-gray-300"
        >
          <NuxtLink
            :to="{
              name: 'store-storeid-category',
              params: { storeid: store.id },
            }"
            class="!size-40 rounded-2xl overflow-hidden relative shrink-0 border-4 p-2 flex items-center"
            :class="{
              'border-primary': categoryID === null,
            }"
          >
            <p class="text-3xl font-bold">All Products</p>
          </NuxtLink>
          <NuxtLink
            v-for="(category, index) in categories?.categories"
            :key="index"
            :to="{
              name: 'store-storeid-category',
              params: { storeid: store.id },
              query: { categoryID: category.id },
            }"
            class="!size-40 rounded-2xl overflow-hidden relative shrink-0 border-4"
            :class="{
              'border-primary': categoryID == category.id,
            }"
          >
            <NuxtImg
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover"
            />
            <p
              class="absolute bottom-0 left-0 w-full pt-6 pb-2 px-2 text-white bg-gradient-to-t from-black to-transparent text-sm break-words line-clamp-2"
            >
              {{ category.name }}
            </p>
          </NuxtLink>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-5 gap-5">
        <ProductCard
          v-for="(product, i) in pending ? 12 : data?.products"
          :key="i"
          :product="product"
          :loading="pending"
        />
      </div>
      <div class="flex justify-center items-center">
        <div
          v-if="data?.products && data?.products.length > 0"
          class="flex justify-center items-center mt-5"
        >
          <Pagination
            :items-per-page="perPage"
            :total="data?.total"
            :sibling-count="1"
            show-edges
            :default-page="+page"
          >
            <PaginationList
              v-slot="{ items }"
              class="flex items-center justify-center gap-1 mt-2"
            >
              <PaginationFirst @click="paginateUrl(1)" />
              <PaginationPrev @click="paginateUrl(+page - 1)" />

              <template v-for="(item, index) in items">
                <PaginationListItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                >
                  <Button
                    class="w-9 h-9 p-0"
                    :variant="item.value === page ? 'default' : 'outline'"
                    @click="paginateUrl(item.value)"
                  >
                    {{ item.value }} {{ page }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext @click="paginateUrl(+page + 1)" />
              <PaginationLast
                @click="paginateUrl(items[items.length - 1].value)"
              />
            </PaginationList>
          </Pagination>
        </div>
      </div>
    </section>
  </Store>
</template>

<script>
export default {
  name: "Category",
  async setup() {
    const route = useRoute();
    const { store } = useFrontend();
    const { api } = useApi();

    const page = computed(() => Number(route.query.page || 1));
    const perPage = computed(() => Number(route.query.perPage || 24));
    const categoryID = computed(() => route.query.categoryID);

    const body = computed(() => {
      const b = {
        storeID: store.value._id,
        page: page.value,
        perPage: perPage.value,
      };
      if (categoryID.value) b.categoryID = categoryID.value;
      return b;
    });

    const { data, pending } = useAsyncData(
      `product-${store.value._id}-${categoryID.value}-${page.value}-${perPage.value}`,
      () => api.post("/store/fetch-category-product", body.value),
      { watch: [page, perPage, categoryID] }
    );

    const { data: categories } = useAsyncData(
      `categories-${store.value._id}`,
      () => api.get("/store/fetch-category-page", { storeID: store.value._id })
    );
    return { data, categories, pending };
  },
  data() {
    return {
      mainImage: "",
      selectVariation: [],
      quantity: 1,
      page: 1,
      perPage: 24,
    };
  },
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
    images() {
      return [this.data?.product?.thumbnail, ...this.data?.product?.gallery];
    },
    checkSelect() {
      return (i, key) =>
        this.selectVariation[i]?.optionID ===
        this.data?.product?.variation[i]?.options[key]?._id;
    },
    selectVariationDetails() {
      return this.selectVariation.map(({ _id, optionID }) => {
        const variation = this.data?.product?.variation.find(
          (v) => v._id === _id
        );
        const option = variation?.options.find((o) => o._id === optionID);
        return {
          _id: variation._id,
          name: variation.name,
          option,
        };
      });
    },
    selectVariationPrice() {
      return this.selectVariationDetails.reduce((acc, variation) => {
        return acc + +variation.option?.price || 0;
      }, +this.data?.product?.price || 0);
    },
    selectVariationDiscount() {
      return this.selectVariationDetails.reduce(
        (acc, variation) => {
          return acc + +variation.option?.discount || 0;
        },
        this.data?.product?.discountStatus
          ? +this.data?.product?.discountPrice || 0
          : 0
      );
    },
    outOfStock() {
      return (
        this.data?.product?.stock === false ||
        this.selectVariationDetails.some((variation) => !variation.option)
      );
    },
    categoryID() {
      return this.$route.query.categoryID || null;
    },
  },
  watch: {
    $route(val) {
      console.log(val.query.page);
      this.page = +val.query.page || 1;
      this.perPage = +val.query.perPage || 24;
    },
  },
  mounted() {
    try {
      this.mainImage = this.data?.product?.thumbnail || "";
      this.selectVariation = this.data?.product?.variation.map(
        ({ _id, options }) => ({
          _id,
          optionID: options.find((o) => o.stock)?._id || null,
        })
      );
      this.page = +this.$route.query.page || 1;
      this.perPage = +this.$route.query.perPage || 24;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    setMainImage(image) {
      this.mainImage = image;
    },
    setSelect(i, key) {
      try {
        this.selectVariation[i].optionID =
          this.data?.product?.variation[i]?.options[key]?._id;
      } catch (error) {
        console.error(error);
      }
    },
    decreaseQuantity() {
      this.quantity = Math.max(1, this.quantity - 1);
    },
    increaseQuantity() {
      this.quantity += 1;
    },
    paginateUrl(page = 1) {
      const { query } = this.$route;
      this.$router.push({
        name: "store-storeid-category",
        params: { storeid: this.store.id },
        query: { ...query, page },
      });
    },
  },
};
</script>
