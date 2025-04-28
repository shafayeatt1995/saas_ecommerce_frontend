<template>
  <div
    v-if="product"
    class="max-w-52 lg:max-w-none flex-shrink-0 border rounded-2xl overflow-hidden"
  >
    <NuxtLink
      :to="{
        name: 'store-storeid-product-productid',
        params: { storeid: store.id, productid: product.slug },
      }"
    >
      <NuxtImg
        :src="product.thumbnail"
        :alt="product.name"
        class="w-full aspect-square object-cover rounded-3xl"
      />
    </NuxtLink>
    <div class="mt-2 space-y-2 p-2 lg:p-4">
      <NuxtLink
        :to="{
          name: 'store-storeid-product-productid',
          params: { storeid: store.id, productid: product.slug },
        }"
        class="text-base lg:text-lg font-bold w-full"
      >
        {{ product.name }}
      </NuxtLink>
      <div class="flex items-center text-xl lg:text-2xl font-bold">
        <p
          v-if="product.discountStatus"
          class="text-gray-400 gap-1.5 lg:gap-2.5 flex"
        >
          <del> {{ $taka }}{{ product.price }} </del>
          <span class="text-gray-800">
            {{ $taka }}{{ product.price - product.discountPrice }}
          </span>
        </p>
        <p v-else>${{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
  },
};
</script>
