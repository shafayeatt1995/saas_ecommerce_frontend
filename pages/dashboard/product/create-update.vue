<template>
  <Admin>
    <h1 class="text-lg lg:text-3xl font-bold">
      {{ editMode ? "Update" : "Create" }} Product
    </h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 mb-5 w-full gap-5">
      <div class="col-span-2 space-y-5">
        <div class="bg-white p-4 shadow-md rounded-xl space-y-2 border">
          <h2 class="text-2xl font-bold mb-2">Product basic info</h2>
          <div>
            <Label for="name">Product name</Label>
            <Input
              id="name"
              type="text"
              v-model="form.name"
              placeholder="Enter product name"
            />
            <ErrorMessage name="name" :error="error" />
          </div>
          <div>
            <p class="font-bold">
              Product price: {{ form.dealingPrice }} + {{ form.commission }} =
              <span v-if="form.discountStatus && form.discount > 0">
                <del>{{ form.price }}</del> {{ form.price - form.discount }}
              </span>
              <span v-else>{{ form.price }}</span>
            </p>
            <div class="flex items-start gap-2">
              <div class="flex-1">
                <Label for="price">Product dealing price</Label>
                <Input
                  id="price"
                  type="number"
                  v-model="form.dealingPrice"
                  placeholder="Enter product dealing price"
                />
                <ErrorMessage name="dealingPrice" :error="error" />
              </div>
              <div class="flex-1">
                <Label for="price">Product commission</Label>
                <Input
                  id="price"
                  type="number"
                  v-model="form.commission"
                  placeholder="Enter product commission"
                />
                <ErrorMessage name="commission" :error="error" />
              </div>
            </div>
          </div>
          <div>
            <Label for="price">Product discount</Label>
            <Select v-model="form.discountStatus">
              <SelectTrigger class="flex-1">
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
            <SlideUpDown
              :duration="300"
              :active="form.discountStatus"
              class="mt-2"
            >
              <Input
                id="discount"
                type="number"
                v-model="form.discount"
                placeholder="Enter product discount amount"
                class="pt-2"
              />
            </SlideUpDown>

            <ErrorMessage name="discount" :error="error" />
          </div>
          <div>
            <Label for="description">Description</Label>
            <ClientOnly>
              <TextEditor v-model="form.description" />
            </ClientOnly>
            <ErrorMessage name="description" :error="error" />
          </div>
        </div>
        <div
          class="bg-white p-4 shadow-md rounded-xl border"
          v-for="(variation, key) in form.variation"
          :key="`variation-${key}`"
        >
          <div class="flex justify-between items-center cursor-pointer">
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
              class="flex gap-2 mb-2 items-center justify-between"
              v-for="(option, index) in variation.options"
              :key="`options-${index}`"
            >
              <Input
                :placeholder="`${variation.name} name`"
                v-model="form.variation[key].options[index].title"
                class="flex-1"
              />
              <Input
                type="number"
                v-model="form.variation[key].options[index].price"
                :placeholder="`${variation.name} price`"
                class="flex-1"
              />
              <Select v-model="form.variation[key].options[index].stock">
                <SelectTrigger class="flex-1">
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
              <Button
                variant="destructiveOutline"
                size="icon"
                class="!w-10"
                v-if="variation.options.length > 1"
                @click="removeOption(key, index)"
              >
                <XIcon class="text-red-500 text-xl" />
              </Button>
            </div>
            <Button type="button" @click="addOption(key)" class="w-full">
              <PlusIcon /> Add {{ variation.name }} Option</Button
            >
          </div>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <form class="flex items-center gap-2" @submit.prevent="addVariation">
            <Input
              id="name"
              type="text"
              v-model="variation"
              placeholder="Enter variation name"
            />
            <Button type="submit"><PlusIcon />Add Variation</Button>
          </form>
        </div>
      </div>
      <div class="col-span-1 space-y-5">
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Product status</h2>
          <Select v-model="form.status">
            <SelectTrigger class="flex-1">
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
            <SelectTrigger class="flex-1">
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
            <div>
              <Select v-model="form.categoryID">
                <SelectTrigger class="flex-1">
                  <SelectValue placeholder="Select product category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Product Category</SelectLabel>
                    <SelectItem
                      :value="category._id"
                      v-for="(category, i) in categories"
                      :key="i"
                    >
                      {{ category.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ErrorMessage name="categoryID" :error="error" />
            </div>
            <div>
              <Select v-model="form.subCategoryID">
                <SelectTrigger class="flex-1">
                  <SelectValue placeholder="Select product sub category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Product Sub-Category</SelectLabel>
                    <SelectItem
                      :value="subCategory._id"
                      v-for="(subCategory, i) in subCategories"
                      :key="i"
                    >
                      {{ subCategory.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ErrorMessage name="subCategoryID" :error="error" />
            </div>
          </div>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Product images</h2>
          <div
            class="border border-dashed flex items-center justify-center min-h-44 cursor-pointer rounded-xl p-2"
            @click="imageModal = true"
          >
            <ImageIcon :size="100" v-if="form.images.length === 0" />
            <div
              class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-5"
              v-else
            >
              <div
                v-for="(image, i) in form.images"
                :key="i"
                class="relative max-h-28"
              >
                <img
                  :src="image"
                  class="size-full object-contain drop-shadow-xl rounded-lg"
                  @click.stop="previewImage(image)"
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
            type="text"
            v-model="form.video"
            placeholder="Enter product video url"
          />
          <ErrorMessage name="video" :error="error" />
          <div v-html="form.video" class="video-width mt-2"></div>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <Button class="w-full" @click="submit">
            <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
            {{ editMode ? "Update" : "Create" }} Product
          </Button>
        </div>
      </div>
    </div>
  </Admin>
  <ImageModal
    :modal="imageModal"
    @close="imageModal = false"
    multiSelect
    v-model="form.images"
  />
</template>

<script>
import eventBus from "@/lib/eventBus";
import { ImageIcon, LoaderIcon, PlusIcon, XIcon } from "lucide-vue-next";
import SlideUpDown from "vue-slide-up-down";
import { toast } from "vue-sonner";

export default {
  name: "CreateUpdateProduct",
  components: {
    PlusIcon,
    XIcon,
    SlideUpDown,
    ImageIcon,
    LoaderIcon,
  },
  data() {
    return {
      showMaterial: false,
      form: {
        name: "",
        price: 0,
        dealingPrice: 0,
        commission: 0,
        status: true,
        description: "",
        variation: [],
        video: "",
        categoryID: "",
        subCategoryID: "",
        stock: true,
        discountStatus: false,
        discount: 0,
        images: [],
      },
      error: {},
      variation: "",
      categories: [],
      subCategories: [],
      imageModal: false,
      loading: false,
      initLoad: false,
    };
  },
  computed: {
    editMode() {
      return !!this.$route.query.id;
    },
  },
  watch: {
    "form.categoryID"() {
      if (!this.initLoad) return;
      this.form.subCategoryID = "";
      this.fetchSubCategory();
    },
    "form.dealingPrice"() {
      this.form.price = this.form.dealingPrice + this.form.commission;
    },
    "form.commission"() {
      this.form.price = this.form.dealingPrice + this.form.commission;
    },
  },
  mounted() {
    this.trigger();
    if (this.editMode) {
      this.fetchProduct();
    } else {
      this.fetchCategory();
      this.initLoad = true;
    }
    this.interval = setInterval(() => {
      this.trigger();
    }, 12 * 60 * 1000);
  },
  methods: {
    async fetchProduct() {
      try {
        this.loading = true;
        const { api } = useApi();
        const { item } = await api.get("/admin/product/single-product", {
          id: this.$route.query.id,
        });
        this.form = item;
        await this.fetchCategory();
        await this.fetchSubCategory();
        this.initLoad = true;
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
      } catch (error) {}
    },
    async fetchCategory() {
      try {
        const { api } = useApi();
        const { items } = await api.get2("/admin/product/category");
        this.categories = items;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSubCategory() {
      try {
        const { api } = useApi();
        const { items } = await api.get2("/admin/product/sub-category", {
          _id: this.form.categoryID,
        });
        this.subCategories = items;
      } catch (error) {
        console.error(error);
      }
    },
    addVariation() {
      if (!this.form.variation[this.variation] && this.variation.length > 0) {
        this.form.variation.push({
          name: this.variation,
          options: [{ title: "", price: 0, stock: true }],
        });
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
        stock: true,
      });
    },
    removeOption(key, index) {
      this.form.variation[key].options.splice(index, 1);
    },
    previewImage(url) {
      eventBus.emit("previewImage", new Set([url, ...this.form.images]));
    },
    async submit() {
      try {
        this.loading = true;
        this.error = {};
        const { api } = useApi();
        await api.post("/admin/product", this.form);
        toast.success(
          `Product ${this.editMode ? "updated" : "created"} successfully`
        );
        this.$router.push("/admin/product");
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
  },
};
</script>

<style>
.video-width iframe {
  @apply max-h-52 !w-full;
}
</style>
