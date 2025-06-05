<template>
  <div
    v-if="product"
    class="w-full flex-shrink-0 border rounded-2xl overflow-hidden"
  >
    <Skeleton v-if="loading" class="w-full aspect-square" />
    <NuxtLink
      v-else
      :to="{
        name: 'store-storeid-product-slug',
        params: { storeid: store?.id, slug: product?.slug },
      }"
    >
      <img
        :src="product.thumbnail"
        :alt="product.name"
        class="w-full aspect-square object-cover"
      />
    </NuxtLink>
    <div class="space-y-2 px-2 py-3">
      <Skeleton v-if="loading" class="w-full h-5" />
      <NuxtLink
        v-else
        :to="{
          name: 'store-storeid-product-slug',
          params: { storeid: store?.id, slug: product?.slug },
        }"
        class="block break-words line-clamp-2 leading-tight text-sm md:text-base"
      >
        {{ product.name }}
      </NuxtLink>
      <div class="flex items-center text-sm md:text-base">
        <Skeleton v-if="loading" class="w-1/2 h-5" />
        <p
          v-else-if="product.discountStatus"
          class="text-gray-400 gap-1.5 lg:gap-2.5 flex"
        >
          <del> {{ $taka }}{{ product.price }} </del>
          <span class="text-gray-800">
            {{ $taka }}{{ product.price - product.discountPrice }}
          </span>
        </p>
        <p v-else>{{ $taka }}{{ product.price }}</p>
      </div>
      <div class="flex justify-center">
        <NuxtLink
          v-if="product?.slug"
          :to="{
            name: 'store-storeid-product-slug',
            params: { storeid: store?.id, slug: product?.slug },
          }"
          class="w-full mt-3 !text-base !rounded-full !py-5"
          :class="cn(buttonVariants({ variant: 'default' }))"
          >View Product</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script>
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export default {
  name: "ProductCard",
  props: {
    product: {
      type: [Object, Number],
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
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
