<template>
  <section class="border-b">
    <div class="container mx-auto py-4 px-4 lg:px-0">
      <div class="flex items-center justify-between gap-5">
        <div class="flex flex-1 items-center gap-10">
          <MenuIcon :size="26" class="cursor-pointer lg:hidden" />
          <NuxtLink :to="`/store/${store.id}`">
            <NuxtImg
              :src="store.logo"
              class="max-w-40 max-h-16 object-contain"
              :alt="store.name"
            />
          </NuxtLink>
          <ul class="gap-6 hidden md:flex">
            <li>
              <NuxtLink
                :to="{
                  name: 'store-storeid-category',
                  params: { storeid: store.id },
                }"
                class="hover:underline"
                >Category</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                :to="{
                  name: 'store-storeid-products',
                  params: { storeid: store.id },
                }"
                class="hover:underline"
                >Products</NuxtLink
              >
            </li>
          </ul>
        </div>
        <div class="flex-1 lg:flex justify-end items-center gap-5">
          <form class="relative w-full">
            <label htmlFor="search" class="absolute left-3 top-3 text-black/40">
              <SearchIcon />
            </label>
            <input
              type="search"
              placeholder="Search for products..."
              class="w-full bg-[#F0F0F0] border-none outline-none py-3 pl-12 pr-5 rounded-full text-black/40"
            />
          </form>
          <ul class="flex gap-3.5">
            <li class="lg:hidden">
              <a href="#">
                <SearchIcon />
              </a>
            </li>
            <li>
              <a href="#">
                <ShoppingCartIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "lucide-vue-next";

export default {
  name: "Header",
  components: {
    ChevronDownIcon,
    MenuIcon,
    SearchIcon,
    ShoppingCartIcon,
  },
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
  },
};
</script>
