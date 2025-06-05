<template>
  <Head>
    <title>{{ data?.product?.name }} - {{ store?.name }}</title>
  </Head>
  <Store>
    <section class="container mx-auto px-4 lg:px-0 py-10">
      <div class="flex flex-col lg:flex-row justify-between gap-5">
        <div class="w-full max-h-[500px] grid grid-cols-4 grid-rows-4 gap-2">
          <div class="relative h-[500px] overflow-auto space-y-2">
            <img
              v-for="(image, i) in images"
              :key="i"
              :src="image"
              :alt="data?.product?.name"
              class="w-full object-cover aspect-auto rounded-xl cursor-pointer border-2"
              :class="
                selectImage === i ? ' border-black' : 'border-transparent'
              "
              @click="setMainImage(i)"
            />
          </div>
          <div
            class="w-full flex justify-center items-center lg:col-span-4 xl:col-span-3 lg:row-span-3 xl:row-span-4 relative max-h-[500px]"
          >
            <VueImageZoomer
              v-if="mainImage"
              :regular="mainImage"
              :zoom="mainImage"
              :zoomAmount="3"
              img-class="rounded-xl size-full object-cover aspect-square"
            >
              <img :src="mainImage" :alt="data?.product?.name" />
            </VueImageZoomer>
            <button
              class="absolute bottom-2 right-2 z-10 bg-white p-2 rounded-full"
              @click="previewImage(images)"
            >
              <ExpandIcon />
            </button>
          </div>
        </div>
        <div
          class="w-full lg:col-span-4 xl:col-span-1 lg:row-span-1 xl:row-span-4"
        >
          <h1 class="text-2xl lg:text-[40px] font-bold pb-3">
            {{ data?.product?.name }}
          </h1>
          <div class="pb-3 text-2xl font-bold">
            <p v-if="outOfStock" class="text-rose-500">Out of Stock</p>
            <div
              class="flex items-center gap-2.5"
              v-else-if="
                data?.product?.discountStatus && selectVariationDiscount > 0
              "
            >
              <del class="text-gray-500" v-if="selectVariationDiscount">
                {{ $taka }}{{ selectVariationPrice }}
              </del>
              <p>
                {{ $taka }}{{ selectVariationPrice - selectVariationDiscount }}
              </p>
            </div>
            <p v-else class="flex items-center gap-2.5">
              {{ $taka }}{{ selectVariationPrice }}
            </p>
          </div>
          <p
            class="text-black/60 pb-2 text-sm lg:text-base"
            v-if="data?.product?.shortDescription"
          >
            {{ data?.product?.shortDescription }}
          </p>
          <template
            v-for="(variation, i) in data?.product?.variation"
            :key="i"
            v-if="
              data?.product?.variation && data?.product?.variation.length > 0
            "
          >
            <div class="py-3">
              <p class="mb-2 text-sm lg:text-base">
                Select {{ variation.name }}
              </p>
              <div class="flex flex-wrap items-center gap-4">
                <div class="flex items-center flex-wrap lg:gap-4 gap-2">
                  <Button
                    v-for="(option, key) in variation.options"
                    :key="key"
                    class="px-6 py-3 rounded-full flex justify-center items-center cursor-pointer"
                    :variant="checkSelect(i, key) ? 'default' : 'outline'"
                    @click="option.stock ? setSelect(i, key) : null"
                    :disabled="!option.stock"
                  >
                    {{ option.title }}
                  </Button>
                </div>
              </div>
            </div>
          </template>
          <div class="py-3">
            <div class="flex items-center gap-2">
              <div
                class="bg-gray-100 w-32 rounded-full py-4 px-5 flex justify-between items-center select-none"
              >
                <MinusIcon class="cursor-pointer" @click="decreaseQuantity()" />
                <p>{{ quantity }}</p>
                <PlusIcon class="cursor-pointer" @click="increaseQuantity()" />
              </div>
              <Button
                variant="outline"
                class="flex-1 py-7 rounded-full text-base"
                :disabled="outOfStock"
                @click="addToCart"
              >
                <ShoppingCartIcon />
                Add to Cart
              </Button>
              <Button
                class="flex-1 py-7 rounded-full text-base"
                :disabled="outOfStock"
              >
                <ShoppingBasketIcon />
                Buy Now
              </Button>
            </div>
          </div>
          <div class="py-3">
            <div
              class="flex justify-around items-center bg-gray-50 p-4 rounded-2xl border"
            >
              <a
                v-if="store?.phone"
                class="text-center text-lg font-semibold"
                :href="`tel:${store?.phone}`"
              >
                <span>Call if needed:</span>
                <br />
                <span class="border-b-2 border-black">{{ store?.phone }}</span>
              </a>
              <a
                v-if="marketing?.whatsapp"
                :href="`https://wa.me/${marketing?.whatsapp}`"
                target="_blank"
                :class="cn(buttonVariants({ variant: 'success' }))"
                class="py-7 !px-16 !rounded-full !text-base"
              >
                <svg
                  fill="currentColor"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 308 308"
                  xml:space="preserve"
                >
                  <g id="XMLID_468_">
                    <path
                      id="XMLID_469_"
                      d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156
		c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687
		c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887
		c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153
		c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348
		c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802
		c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922
		c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0
		c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458
		C233.168,179.508,230.845,178.393,227.904,176.981z"
                    />
                    <path
                      id="XMLID_470_"
                      d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716
		c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396
		c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z
		 M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188
		l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677
		c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867
		C276.546,215.678,222.799,268.994,156.734,268.994z"
                    />
                  </g>
                </svg>
                Whatsapp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <hr />
    <section class="container mx-auto px-4 py-10 lg:px-0">
      <div class="flex justify-between items-center">
        <p class="text-xl lg:text-2xl font-bold">Description</p>
      </div>
      <div v-html="data?.product?.description" class="pt-5"></div>
    </section>
    <hr />
    <section class="container mx-auto px-4 py-10 lg:px-0">
      <h2
        class="font-black text-4xl lg:text-5xl text-center lg:pb-14 pb-8 uppercase px-14"
      >
        You might also like
      </h2>
      <div class="overflow-x-auto pb-5">
        <div
          class="flex lg:grid lg:grid-cols-4 gap-5 whitespace-nowrap scrollbar-thin scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-thumb-gray-300 mr-4"
        >
          <ProductCard
            v-for="(product, i) in data?.relatedProducts"
            :key="i"
            :product="product"
          />
        </div>
      </div>
    </section>
  </Store>
</template>

<script>
import { buttonVariants } from "@/components/ui/button";
import eventBus from "@/lib/eventBus";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  ExpandIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBasketIcon,
  ShoppingCartIcon,
} from "lucide-vue-next";
import { VueImageZoomer } from "vue-image-zoomer";
import "vue-image-zoomer/dist/style.css";
import { toast } from "vue-sonner";

export default {
  name: "Products",
  components: {
    ChevronDownIcon,
    MinusIcon,
    PlusIcon,
    VueImageZoomer,
    ShoppingBasketIcon,
    ShoppingCartIcon,
    ExpandIcon,
  },
  async setup() {
    try {
      const { params } = useRoute();
      const { store } = useFrontend();
      const { api } = useApi();
      const { data } = await useAsyncData(
        `product-${params.slug}`,
        async () =>
          await api.get("/store/fetch-product", {
            storeID: store.value._id,
            slug: params.slug,
          })
      );
      return { data };
    } catch (error) {
      console.error(error);
      return { error };
    }
  },
  data() {
    return {
      mainImage: "",
      selectVariation: [],
      quantity: 1,
      selectImage: 0,
    };
  },
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
    marketing() {
      const { marketing } = useFrontend();
      return marketing.value;
    },
    images() {
      return [
        this.data?.product?.thumbnail,
        ...(this.data?.product?.gallery || []),
      ];
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
  },
  created() {
    if (typeof window == "undefined") {
      if (!this.data?.product) {
        throw createError({
          statusCode: 404,
          statusMessage: "Product Not Found",
        });
      }
    }
  },
  mounted() {
    try {
      if (this.data?.product) {
        this.mainImage = this.data?.product?.thumbnail || "";
        this.selectVariation = this.data?.product?.variation.map(
          ({ _id, options }) => ({
            _id,
            optionID: options.find((o) => o.stock)?._id || null,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    cn,
    buttonVariants,
    setMainImage(i) {
      this.selectImage = i;
      this.mainImage = this.images[i];
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
    previewImage() {
      const images = [...new Set([this.mainImage, ...this.images])];
      eventBus.emit("previewImage", images);
    },
    addToCart() {
      if (
        this.selectVariationDetails.length ===
        this.data?.product?.variation.length
      ) {
        const { addToCart } = useCart();
        addToCart({
          ...this.data?.product,
          variation: this.selectVariationDetails,
        });
        toast.success("Product added to cart");
      }
    },
  },
};
</script>

<style>
.vh--outer.vh--rel,
.vh--holder.vh--rel.vh--flex.vh--jc,
.vh--holder.vh--rel.vh--flex.vh--jc picture,
.vh--outer.vh--rel {
  height: 100%;
  width: 100%;
}
</style>
