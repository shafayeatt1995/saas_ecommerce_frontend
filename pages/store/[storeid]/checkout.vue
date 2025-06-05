<template>
  <Head
    ><title>Checkout - {{ store.name }}</title></Head
  >
  <Store>
    <section class="container mx-auto px-4 lg:px-0 pb-20 mt-5">
      <h1 class="text-4xl font-black uppercase mb-3">Checkout</h1>
      <ClientOnly>
        <div class="flex flex-col lg:flex-row gap-5">
          <div class="flex-[3] space-y-5">
            <div class="border rounded-3xl p-3.5 lg:px-6 lg:py-5 w-full">
              <h3 class="font-bold text-xl lg:text-2xl">Product Details</h3>
              <div class="space-y-5 mt-2">
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
                  <hr
                    v-if="i !== cart.items.length - 1"
                    class="border-gray-300"
                  />
                </template>
              </div>
            </div>
            <div
              class="border rounded-3xl space-y-6 p-3.5 lg:px-6 lg:py-5 w-full"
            >
              <h3 class="font-bold text-xl lg:text-2xl">
                Please fill out the form with correct information.
              </h3>
              <div class="space-y-4">
                <div>
                  <label for="name">Name (আপনার নাম)</label>
                  <Input
                    id="name"
                    v-model="form.name"
                    placeholder="সম্পূর্ণ নাম লিখুন"
                    class="py-6 rounded-full mt-1 !text-base"
                  />
                  <ErrorMessage :error="error" name="name" />
                </div>
                <div>
                  <label for="phone">Mobile Number (আপনার মোবাইল নম্বর)</label>
                  <Input
                    id="phone"
                    v-model="form.phone"
                    placeholder="017XXXXXXXX"
                    class="py-6 rounded-full mt-1 !text-base"
                  />
                  <ErrorMessage :error="error" name="phone" />
                </div>
                <div>
                  <label for="district">District (জেলা)</label>
                  <Select v-model="form.district">
                    <SelectTrigger
                      class="w-full py-6 rounded-full mt-1 !text-base"
                    >
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="district in filteredItems"
                          :key="district.value"
                          :value="district.value"
                        >
                          {{ district.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <ErrorMessage :error="error" name="district" />
                </div>
                <div>
                  <label for="address">Full Address (সম্পূর্ণ ঠিকানা)</label>
                  <Input
                    id="address"
                    v-model="form.address"
                    placeholder="হাউজ নাম্বার, রোড, ইউনিয়ন, উপজেলা, জেলা"
                    class="py-6 rounded-full mt-1 !text-base"
                  />
                  <ErrorMessage :error="error" name="address" />
                </div>
                <div>
                  <label for="additionalInfo"
                    >Additional Information (অতিরিক্ত তথ্য)</label
                  >
                  <Textarea
                    id="additionalInfo"
                    v-model="form.additionalInfo"
                    placeholder="আপনার স্পেশাল কোন রিকোয়ারমেন্ট থাকলে এখানে লিখুন"
                    class="rounded-xl mt-1 !text-base"
                  />
                  <ErrorMessage :error="error" name="additionalInfo" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex-[2] space-y-5">
            <div
              class="border rounded-3xl space-y-6 p-3.5 lg:px-6 lg:py-5 w-full"
            >
              <h3 class="font-bold text-xl lg:text-2xl">
                Select shipping Address
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(address, i) in shippingAddress"
                  :key="i"
                  class="flex items-center gap-2 cursor-pointer"
                  @click="activeShipping = i"
                >
                  <p
                    class="shadow-[0_0_0_2px] shadow-gray-800 border-2 border-white rounded-full size-4"
                    :class="{
                      'bg-gray-800': activeShipping === i,
                    }"
                  ></p>
                  <div>
                    {{ address.address }}
                    <small>({{ $taka }}{{ address.charge }})</small>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="border rounded-3xl space-y-6 p-3.5 lg:px-6 lg:py-5 w-full"
            >
              <h3 class="font-bold text-xl lg:text-2xl">Select payment</h3>
              <div class="space-y-2">
                <div class="grid grid-cols-2 gap-4">
                  <div
                    class="flex items-center gap-2 cursor-pointer"
                    @click="form.paymentMethod = 'cod'"
                    v-if="payment?.cod"
                  >
                    <p
                      class="shadow-[0_0_0_2px] shadow-gray-800 border-2 border-white rounded-full size-4"
                      :class="{
                        'bg-gray-800': form.paymentMethod === 'cod',
                      }"
                    ></p>
                    <p>Cash on delivery</p>
                  </div>
                  <div
                    class="flex items-center gap-2 cursor-pointer"
                    @click="form.paymentMethod = 'bkash'"
                    v-if="payment?.bkash"
                  >
                    <p
                      class="shadow-[0_0_0_2px] shadow-gray-800 border-2 border-white rounded-full size-4"
                      :class="{
                        'bg-gray-800': form.paymentMethod === 'bkash',
                      }"
                    ></p>
                    <p>bKash</p>
                  </div>
                </div>
                <div class="pt-2">
                  <transition name="fade" mode="out-in">
                    <div v-if="form.paymentMethod === 'cod'">
                      {{ payment?.cod?.message }}
                    </div>
                    <div v-else-if="form.paymentMethod === 'bkash'">
                      {{ payment?.bkash?.message }}
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <div
              class="px-5 lg:px-6 py-5 border rounded-3xl space-y-4 lg:space-y-6"
            >
              <h3 class="font-bold text-xl lg:text-2xl">Order Summery</h3>
              <div class="space-y-5">
                <div class="flex justify-between">
                  <p class="text-gray-800 text-base lg:text-xl">
                    Product Price
                  </p>
                  <p class="font-bold text-base lg:text-xl">
                    {{ $taka }}{{ subtotal }}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-800 text-base lg:text-xl">Discount</p>
                  <p class="font-bold text-base lg:text-xl">
                    - {{ $taka }}{{ subDiscount }}
                  </p>
                </div>
                <div class="flex justify-between" v-if="couponDiscount > 0">
                  <p
                    class="text-gray-800 text-base lg:text-xl flex items-center gap-1"
                  >
                    Coupon
                    <XIcon @click="couponDiscount = 0" class="cursor-pointer" />
                  </p>
                  <p class="font-bold text-base lg:text-xl">
                    - {{ $taka }}{{ couponDiscount }}
                  </p>
                </div>
                <hr />
                <div class="flex justify-between">
                  <p class="text-gray-800 text-base lg:text-xl">Sub Total</p>
                  <p class="font-bold text-base lg:text-xl">
                    {{ $taka }}{{ subtotal - subDiscount - couponDiscount }}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-800 text-base lg:text-xl">Shipping fee</p>
                  <p class="font-bold text-base lg:text-xl">
                    {{ $taka }}{{ selectedShippingAddress?.charge || 0 }}
                  </p>
                </div>
                <hr />
                <div class="flex justify-between">
                  <p class="text-gray-800 text-base lg:text-xl">Total</p>
                  <p class="font-bold text-xl lg:text-2xl">
                    {{ $taka
                    }}{{
                      subtotal -
                        subDiscount -
                        couponDiscount +
                        selectedShippingAddress?.charge || 0
                    }}
                  </p>
                </div>
              </div>
              <form
                class="flex gap-2"
                @submit.prevent="applyCoupon"
                v-if="couponDiscount === 0"
              >
                <Input
                  v-model="coupon"
                  placeholder="Enter coupon code"
                  class="py-6 rounded-full bg-gray-50 !text-base"
                />
                <Button
                  type="submit"
                  class="rounded-full py-6 !px-8 text-base"
                  :disabled="couponLoading"
                >
                  <Loader2Icon
                    v-if="couponLoading"
                    class="animate-spin size-5"
                  />
                  Apply
                </Button>
              </form>

              <Button @click="submit" class="w-full rounded-full py-6 text-lg">
                Place Order <ArrowRightIcon />
              </Button>
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
  Loader2Icon,
  XIcon,
  CheckIcon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import district from "@/assets/json/district.json";

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
    Loader2Icon,
    XIcon,
    CheckIcon,
  },
  data() {
    return {
      coupon: "",
      couponLoading: false,
      couponDiscount: 0,
      shippingLoading: false,
      shippingAddress: [],
      activeShipping: null,
      payment: null,
      form: {
        name: "anik",
        phone: "01728293635",
        district: "Dhaka",
        address: "Krtipur, Naogaon, Dhaka",
        additionalInfo: "",
        paymentMethod: "cod",
        couponCode: "",
      },
      orderLoading: false,
      error: {},
      busy: false,
    };
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
    selectedShippingAddress() {
      return this.shippingAddress[this.activeShipping] || null;
    },
    filteredItems() {
      return district.map((item) => ({
        value: item,
        label: item,
      }));
    },
  },
  mounted() {
    this.fetchCheckoutInfo();
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
    async applyCoupon() {
      try {
        if (this.couponDiscount > 0) return;
        this.couponLoading = true;
        const { api } = useApi();
        const { totalDiscount } = await api.post("/store/apply-coupon", {
          coupon: this.coupon,
          storeID: this.store._id,
          items: this.cart.items,
          total: this.subtotal,
          discount: this.subDiscount,
        });
        this.form.couponCode = this.coupon;
        this.coupon = "";
        this.couponDiscount = totalDiscount;
        toast.success("Coupon applied successfully");
      } catch (error) {
        console.error(error);
        const message = error.response?._data?.message;
        if (message) toast.error(message);
      } finally {
        this.couponLoading = false;
      }
    },
    async fetchCheckoutInfo() {
      try {
        this.shippingLoading = true;
        const { api } = useApi();
        const { addresses, payment } = await api.get("/store/checkout-info", {
          storeID: this.store._id,
        });
        this.shippingAddress = addresses;
        if (addresses.length) this.activeShipping = 0;
        this.payment = payment;
        this.form.paymentMethod = payment.cod ? "cod" : "bkash";
      } catch (error) {
        console.error(error);
      } finally {
        this.shippingLoading = false;
      }
    },
    async submit() {
      try {
        if (this.busy) return;
        this.busy = true;
        const { api } = useApi();
        await api.post("/store/create-order", {
          ...this.form,
          shippingAddress: this.selectedShippingAddress._id,
          couponCode: undefined,
          extraInfo: {
            storeID: this.store._id,
            items: this.cart.items,
            total: this.subtotal,
            discount: this.subDiscount,
            couponDiscount: this.couponDiscount,
            coupon: this.form.couponCode,
          },
        });
        toast.success("Order placed successfully");
      } catch (error) {
        console.error(error);
        const err = error.response?._data?.errors;
        if (err) this.error = err;
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
