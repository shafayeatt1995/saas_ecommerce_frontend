<template>
  <div class="flex gap-3 lg:gap-5 items-center min-w-0">
    <NuxtLink
      :to="{
        name: 'store-storeid-product-slug',
        params: { storeid: store.id, slug: item.slug },
      }"
      class="w-24 lg:w-32 h-24 lg:h-32"
    >
      <img
        :src="item.thumbnail"
        :alt="item.name"
        class="object-cover rounded-xl !size-full"
      />
    </NuxtLink>
    <div class="flex flex-col justify-between flex-1">
      <div class="overflow-hidden">
        <div class="flex items-center gap-1.5 w-full">
          <NuxtLink
            :to="{
              name: 'store-storeid-product-slug',
              params: { storeid: store.id, slug: item.slug },
            }"
            class="font-bold lg:text-xl flex-1"
          >
            {{ item.name }}
          </NuxtLink>
          <Trash2Icon
            class="w-6 text-rose-500 cursor-pointer flex-shrink-0"
            @click="removeItem"
          />
        </div>
        <p
          class="text-sm"
          v-for="(variation, key) in item.variation"
          :key="key + 'variation'"
        >
          {{ variation.name }}:
          <span class="text-gray-500">{{ variation.option.title }}</span>
        </p>
      </div>
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <p v-if="getDiscount(item) > 0" class="flex items-center gap-2">
            <del>{{ $taka }}{{ getPrice(item) }}</del>
            <span>{{ $taka }}{{ getPrice(item) - getDiscount(item) }}</span>
          </p>
          <p v-else>{{ $taka }}{{ getPrice(item) }}</p>
          <p class="text-gray-500">x {{ item.quantity }}</p>
        </div>
        <div
          class="bg-gray-100 rounded-full px-2 flex items-center gap-1 text-sm"
        >
          <Button
            variant="ghost"
            size="icon"
            @click="decreaseQuantity"
            :disabled="item.quantity <= 1"
          >
            <MinusIcon class="cursor-pointer" :size="15" />
          </Button>

          <p class="font-semibold">{{ item.quantity }}</p>
          <Button variant="ghost" size="icon" @click="increaseQuantity">
            <PlusIcon class="cursor-pointer" :size="15" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PlusIcon, MinusIcon, Trash2Icon } from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "CartItem",
  components: {
    PlusIcon,
    MinusIcon,
    Trash2Icon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
    getPrice() {
      return (item = []) =>
        item?.variation.reduce((acc, variation) => {
          return acc + +variation.option?.price || 0;
        }, +item.price || 0) * (item?.quantity || 1);
    },
    getDiscount() {
      return (item = []) =>
        item?.variation.reduce((acc, variation) => {
          return acc + +variation.option?.discount || 0;
        }, +item?.discountPrice || 0) * (item?.quantity || 1);
    },
  },
  methods: {
    removeItem() {
      if (!confirm("Are you sure you want to remove this product?")) return;
      const { removeItem } = useCart();
      removeItem(this.index);
      toast.success("Product removed from cart");
    },
    increaseQuantity() {
      const { increaseQuantity } = useCart();
      increaseQuantity(this.index);
    },
    decreaseQuantity() {
      const { decreaseQuantity } = useCart();
      decreaseQuantity(this.index);
    },
  },
};
</script>
