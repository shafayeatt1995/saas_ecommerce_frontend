<template>
  <transition name="fade">
    <div
      v-if="cart.showCart"
      class="fixed inset-0 bg-black/50 z-10"
      @click="cart.showCart = false"
    ></div>
  </transition>
  <transition name="slide">
    <div
      v-if="cart.showCart"
      class="fixed top-0 right-0 z-20 bg-white w-[450px] h-screen p-5 border-l shadow-xl"
    >
      <div class="flex flex-col gap-3 h-full">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Shopping Cart</h2>
          <button @click="cart.showCart = false"><XIcon /></button>
        </div>
        <div class="h-full overflow-auto">
          <div
            v-if="cart.items.length === 0"
            class="text-center py-16 flex flex-col items-center justify-center gap-2 h-full"
          >
            <PackageOpenIcon :size="150" class="text-gray-800" />
            <p class="text-gray-800 text-lg font-semibold">
              Your cart is empty
            </p>
          </div>
          <div v-else class="flex flex-col gap-3 mt-5">
            <template v-for="(item, i) in cart.items" :key="item._id">
              <div class="flex items-center justify-between relative gap-2">
                <NuxtLink
                  :to="{
                    name: 'store-storeid-product-slug',
                    params: { storeid: store.id, slug: item.slug },
                  }"
                  class="w-20"
                >
                  <img
                    :src="item.thumbnail"
                    :alt="item.name"
                    class="object-cover size-full rounded aspect-square"
                  />
                </NuxtLink>
                <div class="flex-1">
                  <div class="flex">
                    <NuxtLink
                      :to="{
                        name: 'store-storeid-product-slug',
                        params: { storeid: store.id, slug: item.slug },
                      }"
                      class="font-semibold w-full"
                    >
                      {{ item.name }}
                    </NuxtLink>
                    <button @click="removeItem(i)" class="text-rose-500">
                      <Trash2Icon :size="20" />
                    </button>
                  </div>
                  <p v-for="(variation, index) in item.variation" :key="index">
                    {{ variation.name }}: {{ variation.option.title }}
                  </p>
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <p
                        v-if="getDiscount(item) > 0"
                        class="flex items-center gap-2"
                      >
                        <del>{{ $taka }}{{ getPrice(item) }}</del>
                        <span
                          >{{ $taka
                          }}{{ getPrice(item) - getDiscount(item) }}</span
                        >
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
                        @click="decreaseQuantity(i)"
                        :disabled="item.quantity <= 1"
                      >
                        <MinusIcon class="cursor-pointer" :size="15" />
                      </Button>

                      <p class="font-semibold">{{ item.quantity }}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        @click="increaseQuantity(i)"
                      >
                        <PlusIcon class="cursor-pointer" :size="15" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <hr v-if="i !== cart.items.length - 1" />
            </template>
          </div>
        </div>
        <div class="border-t pt-4">
          <div
            class="flex items-center justify-between gap-2 w-full text-lg font-semibold"
          >
            <h2>Subtotal</h2>
            <p>{{ $taka }}{{ subtotal }}</p>
          </div>
          <div class="flex gap-2 mt-4">
            <NuxtLink
              :to="{
                name: 'store-storeid-cart',
                params: { storeid: store.id },
              }"
              :class="
                cn(
                  `${buttonVariants({
                    variant: 'outline',
                  })} flex-1 py-5 rounded-full`
                )
              "
              >View Cart</NuxtLink
            >
            <NuxtLink
              :to="{
                name: 'store-storeid-checkout',
                params: { storeid: store.id },
              }"
              :class="
                cn(
                  `${buttonVariants({
                    variant: 'default',
                  })} flex-1 py-5 rounded-full`
                )
              "
              >Checkout</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import {
  XIcon,
  PackageOpenIcon,
  PlusIcon,
  MinusIcon,
  Trash2Icon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default {
  name: "Cart",
  components: {
    XIcon,
    PackageOpenIcon,
    PlusIcon,
    MinusIcon,
    Trash2Icon,
  },
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
    cart() {
      const { cart } = useCart();
      return cart.value;
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
    subtotal() {
      return this.cart.items.reduce((acc, item) => {
        return acc + this.getPrice(item) - this.getDiscount(item);
      }, 0);
    },
  },
  mounted() {
    const { validateItems } = useCart();
    validateItems();
  },
  methods: {
    cn,
    buttonVariants,
    removeItem(i) {
      if (!confirm("Are you sure you want to remove this product?")) return;
      const { removeItem } = useCart();
      removeItem(i);
      toast.success("Product removed from cart");
    },
    increaseQuantity(i) {
      const { increaseQuantity } = useCart();
      increaseQuantity(i);
    },
    decreaseQuantity(i) {
      const { decreaseQuantity } = useCart();
      decreaseQuantity(i);
    },
  },
};
</script>
