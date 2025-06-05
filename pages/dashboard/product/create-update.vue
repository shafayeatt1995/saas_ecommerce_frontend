<template>
  <Head>
    <title>Product create & update</title>
  </Head>
  <Dashboard>
    <h1 class="text-lg lg:text-3xl font-bold flex items-center gap-2">
      <NuxtLink
        to="/dashboard/product"
        :class="cn(buttonVariants({ variant: 'outline' }))"
        ><ChevronLeftIcon /> Back</NuxtLink
      >
      <span> {{ editMode ? "Update" : "Create" }} Product </span>
    </h1>
    <div class="grid grid-cols-1 xl:grid-cols-3 my-3 w-full gap-4">
      <div class="col-span-2 space-y-4">
        <div class="bg-white p-4 shadow-md rounded-xl space-y-2 border">
          <h2 class="text-2xl font-bold mb-2">Product basic info</h2>
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="name">Product name</Label>
              <Input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter product name"
              />
              <ErrorMessage name="name" :error="error" />
            </div>
            <div class="space-y-2">
              <Label for="slug"
                >Product slug
                <span class="text-xs">(For SEO Friendly URL)</span></Label
              >
              <Input
                id="slug"
                v-model="form.slug"
                type="text"
                placeholder="Enter product slug"
              />
              <ErrorMessage name="slug" :error="error" />
            </div>
            <div>
              <p class="font-bold">
                Product price:
                <span v-if="form.discountStatus && form.discountPrice > 0">
                  <del>{{ form.price }}</del>
                  {{ form.price - form.discountPrice }}
                </span>
                <span v-else>{{ form.price }}</span>
              </p>
              <div class="space-y-2">
                <Label for="price">Product price</Label>
                <Input
                  id="price"
                  v-model="form.price"
                  type="number"
                  placeholder="Enter product dealing price"
                />
                <ErrorMessage name="price" :error="error" />
              </div>
            </div>
            <div class="flex gap-2 items-start">
              <div class="flex-1 space-y-2">
                <Label for="price">Product discount</Label>
                <Select v-model="form.discountStatus">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Product discount status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Product Discount</SelectLabel>
                      <SelectItem :value="true"> Yes </SelectItem>
                      <SelectItem :value="false"> No </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex-1 space-y-2">
                <Label
                  for="discount"
                  :class="!form.discountStatus ? 'opacity-50' : ''"
                  >Product discount</Label
                >
                <Input
                  id="discount"
                  v-model="form.discountPrice"
                  type="number"
                  placeholder="Enter product discount amount"
                  class="pt-2"
                  :disabled="!form.discountStatus"
                />
                <ErrorMessage name="discount" :error="error" />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="description"
                >Short description
                <span class="text-xs">(Optional)</span>
              </Label>
              <Textarea v-model="form.shortDescription" />
              <ErrorMessage name="shortDescription" :error="error" />
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <ClientOnly>
                <TextEditor v-model="form.description" />
              </ClientOnly>
              <ErrorMessage name="description" :error="error" />
            </div>
          </div>
        </div>
        <SlideUpDown
          :active="form.variation && form.variation.length > 0"
          :duration="300"
        >
          <div class="bg-white p-4 shadow-md rounded-xl space-y-2 border">
            <h2 class="text-2xl font-bold mb-2">
              Product variation pricing checker
            </h2>
            <div class="space-y-4">
              <div class="flex flex-col justify-center font-bold">
                <div class="flex text-center text-lg">
                  <p class="mr-2">Product price:</p>
                  <p
                    class="flex items-center gap-1"
                    v-if="selectVariationDiscountPrice > 0"
                  >
                    <del>{{ $taka }}{{ selectVariationActualPrice }}</del>
                    <span
                      >{{ $taka
                      }}{{
                        selectVariationActualPrice -
                        selectVariationDiscountPrice
                      }}</span
                    >
                  </p>
                  <p v-else>{{ $taka }}{{ selectVariationActualPrice }}</p>
                </div>
              </div>
              <div
                v-for="(variation, key) in form.variation"
                :key="`variation-${key}`"
                class="flex items-center gap-2"
              >
                <p
                  class="flex gap-2 justify-between items-center cursor-pointer mb-2 text-xl font-bold"
                >
                  {{ variation.name }}:
                </p>
                <div class="flex flex-1 flex-wrap gap-2">
                  <div
                    v-for="(option, index) in variation.options"
                    :key="`option-${index}`"
                    class="flex items-center gap-1"
                  >
                    <Button
                      :variant="
                        checkVariant(key, index) ? 'default' : 'outline'
                      "
                      @click="setVariant(key, index)"
                      :disabled="!option.stock"
                      >{{ option.title }}</Button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SlideUpDown>
        <div
          v-for="(variation, key) in form.variation"
          :key="`variation-${key}`"
          class="bg-white p-4 shadow-md rounded-xl border"
        >
          <div class="flex gap-2 justify-between items-center cursor-pointer">
            <EditMode
              v-model="variation.name"
              showEdit
              tag="h2"
              class="text-2xl font-bold flex items-center"
            />
            <Button
              variant="destructiveOutline"
              size="icon"
              @click="removeVariation(key)"
            >
              <XIcon class="text-2xl text-rose-500" />
            </Button>
          </div>
          <div class="my-2">
            <p class="text-green-500 text-xs my-2">
              The first option will be auto selected.
            </p>
            <div
              v-for="(option, index) in variation.options"
              :key="`options-${index}`"
              class="grid gap-2 mb-6 md:mb-2 items-end justify-between relative"
              :class="
                variation.options && variation.options.length > 1
                  ? 'grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_36px]'
                  : 'grid-cols-1 md:grid-cols-4'
              "
            >
              <div class="space-y-2">
                <Label v-if="isMobile || index === 0" class="font-bold"
                  >Variation name</Label
                >
                <Input
                  v-model="form.variation[key].options[index].title"
                  :placeholder="`${variation.name} name`"
                  class="flex-1"
                />
              </div>
              <div class="space-y-2">
                <Label v-if="isMobile || index === 0" class="font-bold"
                  >Extra price</Label
                >
                <div class="relative">
                  <Input
                    v-model="form.variation[key].options[index].price"
                    type="number"
                    :placeholder="`${variation.name} price`"
                    class="w-full"
                  />
                </div>
              </div>
              <div class="space-y-2">
                <Label v-if="isMobile || index === 0" class="font-bold"
                  >Extra discount
                </Label>
                <Input
                  v-model="form.variation[key].options[index].discount"
                  type="number"
                  :placeholder="`Variation discount amount`"
                  class="w-full"
                />
              </div>
              <div class="space-y-2">
                <Label v-if="isMobile || index === 0" class="font-bold"
                  >Variation stock</Label
                >
                <Select v-model="form.variation[key].options[index].stock">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Stock Status</SelectLabel>
                      <SelectItem :value="true"> Stock Available </SelectItem>
                      <SelectItem :value="false"> Out of Stock </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex gap-1">
                <!-- <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button
                        type="button"
                        size="icon"
                        @click="calculatePrice(key, index)"
                      >
                        <CalculatorIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Variant price Calculator</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> -->
                <Button
                  v-if="variation.options.length > 1"
                  variant="destructiveOutline"
                  size="icon"
                  @click="removeOption(key, index)"
                >
                  <XIcon class="text-rose-500 text-xl" />
                </Button>
              </div>
            </div>
            <Button type="button" class="w-full" @click="addOption(key)">
              <PlusIcon /> Add {{ variation.name }} Option</Button
            >
          </div>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <form class="flex items-start gap-2" @submit.prevent="addVariation">
            <Input
              v-model="variation"
              type="text"
              placeholder="Enter variation name"
            />
            <Button type="submit"><PlusIcon />Add Variation</Button>
          </form>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">SEO information</h2>
          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                v-model="form.metaTitle"
                type="text"
                placeholder="SEO meta title"
              />
              <ErrorMessage name="metaTitle" :error="error" />
            </div>
            <div class="space-y-2">
              <Label for="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                v-model="form.metaDescription"
                placeholder="SEO meta description"
              />
              <ErrorMessage name="metaDescription" :error="error" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-1 space-y-4">
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Product status</h2>
          <Select v-model="form.status">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select product status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Product Status</SelectLabel>
                <SelectItem :value="true"> Published </SelectItem>
                <SelectItem :value="false"> Draft </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Product stock status</h2>
          <Select v-model="form.stock">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select product stock status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Product Stock Status</SelectLabel>
                <SelectItem :value="true"> Stock Available </SelectItem>
                <SelectItem :value="false"> Out of Stock </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Product Category</h2>
          <div class="space-y-2">
            <Select v-model="form.categoryIDs" multiple>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Category</SelectLabel>
                  <SelectItem
                    v-for="(category, i) in categories"
                    :key="i"
                    :value="category._id"
                  >
                    {{ category.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage name="categoryID" :error="error" />
            <Select v-model="form.subCategoryIDs" multiple>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select sub category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Sub Category</SelectLabel>
                  <SelectItem
                    v-for="(subCategory, i) in subCategories"
                    :key="i"
                    :value="subCategory._id"
                  >
                    <p>
                      {{ subCategory.name }}
                      <span class="text-[10px]"
                        >({{ subCategory.category.name }})</span
                      >
                    </p>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage name="subCategoryID" :error="error" />
          </div>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Product thumbnail image</h2>
          <div
            class="border border-dashed flex items-center justify-center min-h-44 cursor-pointer rounded-xl p-2"
            @click="thumbnailModal = true"
          >
            <ImageIcon v-if="!form.thumbnail" :size="100" />
            <div
              v-else
              class="w-full flex justify-center items-center relative max-h-28"
            >
              <img
                :src="form.thumbnail"
                class="w-full h-28 object-contain drop-shadow-xl rounded-lg"
              />
            </div>
          </div>
          <ErrorMessage name="thumbnail" :error="error" />
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Product gallery images</h2>
          <div
            class="border border-dashed flex items-center justify-center min-h-44 cursor-pointer rounded-xl p-2"
            @click="galleryModal = true"
          >
            <ImageIcon v-if="form.gallery.length === 0" :size="100" />
            <div
              v-else
              class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-5"
            >
              <div
                v-for="(image, i) in form.gallery"
                :key="i"
                class="relative max-h-28"
              >
                <img
                  :src="image"
                  class="size-full object-contain drop-shadow-xl rounded-lg"
                />
              </div>
            </div>
          </div>
          <ErrorMessage name="images" :error="error" />
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Product Video</h2>
          <Input
            id="video"
            v-model="form.video"
            type="text"
            placeholder="Youtube embed url"
          />
          <ErrorMessage name="video" :error="error" />
          <div class="video-width mt-2" v-html="form.video"></div>
        </div>

        <div class="bg-white p-4 shadow-md rounded-xl border">
          <Button class="w-full" @click="submit">
            <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
            {{ editMode ? "Update" : "Create" }} Product
          </Button>
        </div>
      </div>
    </div>
  </Dashboard>
  <ImageModal v-model="form.thumbnail" v-model:open="thumbnailModal" />
  <ImageModal v-model="form.gallery" v-model:open="galleryModal" multiSelect />
</template>

<script>
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalculatorIcon,
  ChevronLeftIcon,
  ImageIcon,
  LoaderIcon,
  PlusIcon,
  XIcon,
} from "lucide-vue-next";
import SlideUpDown from "vue-slide-up-down";
import { toast } from "vue-sonner";

export default {
  name: "CreateUpdateProduct",
  components: {
    PlusIcon,
    XIcon,
    ImageIcon,
    LoaderIcon,
    CalculatorIcon,
    ChevronLeftIcon,
    SlideUpDown,
  },
  data() {
    return {
      showMaterial: false,
      form: {
        categoryIDs: [],
        subCategoryIDs: [],
        name: "",
        slug: "",
        price: 0,
        status: true,
        shortDescription: "",
        description: "",
        variation: [],
        video: "",
        stock: true,
        discountStatus: false,
        discountPrice: 0,
        thumbnail: "",
        gallery: [],
        metaTitle: "",
        metaDescription: "",
      },
      error: {},
      variation: "",
      categories: [],
      subCategories: [],
      thumbnailModal: false,
      galleryModal: false,
      loading: false,
      initLoad: true,
      selectVariations: [],
    };
  },
  computed: {
    editMode() {
      return !!this.$route.query.id;
    },
    isMobile() {
      const { value } = useData();
      return value.isMobile;
    },
    variationActualPrice() {
      return (key, index) =>
        (this.form.variation[key].options[index].price || 0) +
        (this.form.price || 0);
    },
    variationDiscountPrice() {
      return (key, index) =>
        (this.form.discountPrice || 0) +
        (this.form.variation[key].options[index].discount || 0);
    },
    checkVariant() {
      return (key, index) => this.selectVariations[key] === index;
    },
    selectedVariant() {
      return () =>
        this.selectVariations.map((v, i) => this.form.variation[i]?.options[v]);
    },
    selectVariationDiscountPrice() {
      return (
        this.selectedVariant().reduce((acc, { discount = 0 }) => {
          return acc + discount;
        }, this.form.discountPrice || 0) || 0
      );
    },
    selectVariationActualPrice() {
      return (
        this.selectedVariant().reduce((acc, { price = 0 }) => {
          return acc + price;
        }, this.form.price || 0) || 0
      );
    },
  },
  watch: {
    "form.discountStatus"(value) {
      if (!value) this.form.discountPrice = 0;
    },
    "form.name"(value) {
      const { strSlug } = useUtils();
      if (!this.initLoad) this.form.slug = strSlug(value, "-");
    },
    "form.categoryIDs"() {
      this.fetchSubCategory();
    },
    subCategories() {
      if (!this.initLoad) this.resetSubCategory();
    },
  },
  mounted() {
    this.trigger();
    if (this.editMode) {
      this.fetchProduct();
    } else {
      this.fetchCategory();
      this.fetchSubCategory();
      this.initLoad = false;
    }
    this.interval = setInterval(() => {
      this.trigger();
    }, 12 * 60 * 1000);
  },
  methods: {
    cn,
    buttonVariants,
    async fetchProduct() {
      try {
        this.loading = true;
        const { api } = useApi();
        const { item } = await api.get("/dashboard/product/single-product", {
          id: this.$route.query.id,
        });
        this.form = item;
        await this.fetchCategory();
        await this.fetchSubCategory();
        this.selectVariations = item.variation.map(() => 0);
        this.initLoad = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async trigger() {
      try {
        const { api } = useApi();
        await api.get2("/");
      } catch (error) {
        console.error(error);
      }
    },
    async fetchCategory() {
      try {
        const { api } = useApi();
        const { items } = await api.get2("/dashboard/product/category");
        this.categories = items;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSubCategory() {
      try {
        const { api } = useApi();
        const { subCategoryIDs, categoryIDs } = this.form;
        const { items } = await api.post2("/dashboard/product/sub-category", {
          subCategoryIDs: subCategoryIDs || [],
          categoryIDs: categoryIDs || [],
        });
        this.subCategories = items;
        return items;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    addVariation() {
      if (!this.variation) {
        toast.error("Please type a variation name");
      } else if (this.form.variation.some((v) => v.name === this.variation)) {
        toast.error("Variation already exists");
      } else {
        this.form.variation.push({
          name: this.variation,
          options: [{ title: "", price: 0, discount: 0, stock: true }],
        });
        this.selectVariations.push(0);
        this.variation = "";
      }
    },
    removeVariation(key) {
      if (confirm("Are you sure you want to delete this variation?")) {
        this.form.variation.splice(key, 1);
      }
    },
    addOption(key) {
      this.form.variation[key].options.push({
        title: "",
        price: 0,
        discount: 0,
        stock: true,
      });
    },
    removeOption(key, index) {
      this.form.variation[key].options.splice(index, 1);
      if (this.selectVariations[key] === index) this.selectVariations[key] = 0;
    },
    async submit() {
      try {
        this.loading = true;
        this.error = {};
        const { api } = useApi();
        if (this.editMode) {
          await api.put("/dashboard/product", this.form);
        } else {
          await api.post("/dashboard/product", this.form);
        }
        toast.success(
          `Product ${this.editMode ? "updated" : "created"} successfully`
        );
        this.$router.push("/dashboard/product");
      } catch (error) {
        console.error(error);
        const errors = error.response?._data?.errors;
        if (errors) {
          this.error = errors;
        }
      } finally {
        this.loading = false;
      }
    },
    calculatePrice(key, index) {
      this.form.variation[key].options[index].discount =
        this.form.variation[key].options[index].discount -
        this.form.discountPrice;

      this.form.variation[key].options[index].price =
        (this.form.variation[key].options[index].price || 0) -
        (this.form.price || 0) +
        (this.form.discountPrice || 0) +
        (this.form.variation[key].options[index].discount || 0);
    },
    setVariant(key, index) {
      this.selectVariations[key] = index;
    },
    resetSubCategory() {
      this.form.subCategoryIDs = this.subCategories
        .map(({ _id }) => _id)
        .filter((id) => this.form.subCategoryIDs.includes(id));
    },
  },
};
</script>

<style>
.video-width iframe {
  max-height: 200px;
  width: 100% !important;
}
.ql-toolbar.ql-snow {
  margin: 0;
}
</style>
