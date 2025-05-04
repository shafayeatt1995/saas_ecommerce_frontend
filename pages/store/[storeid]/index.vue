<template>
  <Head>
    <title>Welcome to {{ store.name }}</title>
    <meta name="keywords" content="store, products, categories" />
    <meta name="description" :content="store.description" />
  </Head>
  <Store>
    <template v-for="(category, i) in data.items" :key="i">
      <section class="py-12">
        <div class="container mx-auto px-4 lg:px-0">
          <h2 class="font-bold text-5xl text-center">
            {{ category.name }}
          </h2>
          <div class="overflow-x-auto py-5">
            <div
              class="flex lg:grid md:grid-cols-3 lg:grid-cols-5 gap-5 whitespace-nowrap scrollbar-thin scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-gray-300 mr-4"
            >
              <template v-if="data.products[i]">
                <ProductCard
                  v-for="(product, key) in data.products[i]"
                  :key="key"
                  :product="product"
                />
              </template>
            </div>
          </div>
          <div class="flex justify-center mt-9">
            <NuxtLink
              :to="{
                name: 'store-storeid-category',
                params: { storeid: store.id },
                query: { categoryID: category.id },
              }"
              class="px-20 mt-3 !text-base !rounded-full !py-6"
              :class="cn(buttonVariants({ variant: 'outline' }))"
            >
              View All
            </NuxtLink>
          </div>
        </div>
      </section>
      <hr />
    </template>
    <!-- <section class="lg:py-16 py-12">
      <div class="container mx-auto px-4 lg:px-0">
        <h2 class="font-bold text-5xl text-center lg:pb-14 py-8">
          TOP SELLING
        </h2>
        <div class="overflow-x-auto pb-5">
          <div
            class="flex lg:grid lg:grid-cols-4 gap-5 whitespace-nowrap scrollbar-thin scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-gray-300 mr-4"
          >
            products
          </div>
        </div>
        <div class="flex justify-center mt-9">
          <button class="py-3 px-20 rounded-full border w-full lg:w-auto">
            View All
          </button>
        </div>
      </div>
    </section>
    <section class="container mx-auto px-4 lg:px-0">
      <div class="bg-[#F0F0F0] lg:p-16 p-6 rounded-4xl">
        <h2 class="font-bold text-4xl lg:text-5xl text-center pb-16 pt-8 px-9">
          BROWSE BY CATEGORY
        </h2>
        <div class="grid lg:grid-cols-3 gap-5">
          <div
            v-for="{ style, i } in styles"
            :key="i"
            class="h-72 bg-white rounded-3xl overflow-hidden relative"
            :class="style.span === 1 ? 'lg:col-span-1' : 'lg:col-span-2'"
          >
            <NuxtImg :src="style.img" class="w-full h-full object-cover" />
            <p class="absolute top-4 left-6 font-bold text-3xl xl">
              {{ style.name }}
            </p>
          </div>
        </div>
      </div>
    </section> -->
  </Store>
</template>

<script>
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default {
  name: "Store",
  async setup() {
    try {
      const { store } = useFrontend();
      const { api } = useApi();
      const { data } = await useAsyncData(
        `home-${store.value.id}`,
        async () =>
          await api.get("/store/fetch-home", { storeID: store.value._id })
      );
      return { data };
    } catch (error) {
      console.error(error);
      return { error };
    }
  },
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
  },
  methods: {
    cn,
    buttonVariants,
  },
};
</script>
