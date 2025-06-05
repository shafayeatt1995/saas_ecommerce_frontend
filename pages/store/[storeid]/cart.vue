<template>
  <Head
    ><title>Cart - {{ store.name }}</title></Head
  >
  <Store>
    <section class="container mx-auto px-4 lg:px-0 pb-20 mt-5">
      <h1 class="text-4xl font-black uppercase mb-3">Your cart</h1>
      <ClientOnly>
        <div class="flex flex-col lg:flex-row gap-5">
          <div
            class="flex-[3] p-3.5 lg:px-6 lg:py-5 border rounded-3xl space-y-6"
          >
            <div
              v-if="cart.items.length === 0"
              class="text-center py-16 flex flex-col items-center justify-center gap-2 h-full"
            >
              <PackageOpenIcon :size="150" class="text-gray-800" />
              <p class="text-gray-800 text-lg font-semibold">
                Your cart is empty
              </p>
            </div>
            <template v-for="(item, i) in cart.items" :key="i" v-else>
              <CartItem :item="item" :index="i" />
              <hr v-if="i !== cart.items.length - 1" class="border-gray-300" />
            </template>
          </div>
          <div class="flex-[2]">
            <div
              class="px-5 lg:px-6 py-5 border rounded-3xl space-y-4 lg:space-y-6"
            >
              <h3 class="font-bold text-xl lg:text-2xl">Order Summery</h3>
              <div class="space-y-5">
                <div class="flex justify-between">
                  <p class="text-black/60 text-base lg:text-xl">Subtotal</p>
                  <p class="font-bold text-base lg:text-xl">
                    {{ $taka }}{{ subtotal }}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="text-black/60 text-base lg:text-xl">Discount</p>
                  <p class="font-bold text-base lg:text-xl">
                    - {{ $taka }}{{ subDiscount }}
                  </p>
                </div>
                <hr />
                <div class="flex justify-between">
                  <p class="text-black/60 text-base lg:text-xl">Total</p>
                  <p class="font-bold text-xl lg:text-2xl">
                    {{ $taka }}{{ subtotal - subDiscount }}
                  </p>
                </div>
              </div>

              <NuxtLink
                :to="{
                  name: 'store-storeid-checkout',
                  params: { storeid: store.id },
                }"
                :class="
                  cn(
                    `${buttonVariants({
                      variant: 'default',
                    })} w-full rounded-full py-6 text-lg`
                  )
                "
              >
                Go to Checkout <ArrowRightIcon />
              </NuxtLink>
            </div>
          </div>
        </div>
      </ClientOnly>
    </section>
  </Store>
</template>
<script>
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  TagIcon,
  Trash2Icon,
  PackageOpenIcon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "Cart",
  components: {
    ArrowRightIcon,
    ChevronRightIcon,
    MinusIcon,
    PlusIcon,
    TagIcon,
    Trash2Icon,
    PackageOpenIcon,
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
        return acc + this.getPrice(item);
      }, 0);
    },
    subDiscount() {
      return this.cart.items.reduce((acc, item) => {
        return acc + this.getDiscount(item);
      }, 0);
    },
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
