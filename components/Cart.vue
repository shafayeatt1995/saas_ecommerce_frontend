<template>
  <transition name="fade">
    <div v-if="cart.showCart" class="fixed inset-0 bg-black/50 z-10"></div>
  </transition>
  <transition name="slide">
    <div
      v-if="cart.showCart"
      class="fixed top-0 right-0 z-20 bg-white w-[450px] h-screen p-5 border-l shadow-xl"
    >
      <div class="flex flex-col gap-5 h-full">
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
            <div
              v-for="(item, i) in cart.items"
              :key="item._id"
              class="flex items-center justify-between relative gap-2"
            >
              <div class="w-20">
                <img
                  :src="item.thumbnail"
                  :alt="item.name"
                  class="object-cover size-full rounded aspect-square"
                />
              </div>
              <div class="flex-1">
                <div class="flex gap-2">
                  <h2 class="font-semibold w-full">{{ item.name }}</h2>
                  <button @click="removeItem(i)" class="">
                    <XIcon :size="15" />
                  </button>
                </div>
                <p v-for="(variation, index) in item.variation" :key="index">
                  {{ variation.name }}: {{ variation.option.title }}
                </p>
                <div class="flex items-center justify-between gap-2">
                  <p
                    v-if="getDiscount(item) > 0"
                    class="flex items-center gap-2"
                  >
                    <del>{{ $taka }}{{ getPrice(item) }}</del>
                    <span
                      >{{ $taka }}{{ getPrice(item) - getDiscount(item) }}</span
                    >
                  </p>
                  <p v-else>{{ $taka }}{{ getPrice(item) }}</p>
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
          </div>
        </div>
        <div class="border-t pt-4">
          <div
            class="flex items-center justify-between gap-2 w-full text-lg font-semibold"
          >
            <h2>Subtotal</h2>
            <p>
              {{ $taka
              }}{{ cart.items.reduce((acc, item) => acc + getPrice(item), 0) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { XIcon, PackageOpenIcon, PlusIcon, MinusIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "Cart",
  components: {
    XIcon,
    PackageOpenIcon,
    PlusIcon,
    MinusIcon,
  },
  computed: {
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
  },
  methods: {
    removeItem(i) {
      const { removeItem } = useCart();
      removeItem(i);
      toast.success("Product removed from cart");
    },
    increaseQuantity(i) {
      console.log(i);
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
