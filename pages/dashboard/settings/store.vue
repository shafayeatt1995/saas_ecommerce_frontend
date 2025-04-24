<template>
  <Dashboard>
    <h1 class="text-2xl font-bold">Store settings</h1>
    <div class="flex gap-4 mt-2 flex-col-reverse lg:flex-row">
      <div class="flex-[2]">
        <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2 border">
          <h2 class="text-lg font-bold mb-2">Store basic info</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="storeID">Store ID</Label>
              <Skeleton v-if="initLoading" class="w-full h-4" />
              <Input
                id="storeID"
                v-model="form.id"
                type="text"
                disabled
                v-else
              />
            </div>
            <div class="space-y-2">
              <Label for="name">Store name</Label>
              <Skeleton v-if="initLoading" class="w-full h-4" />
              <Input id="name" v-model="form.name" type="text" v-else />
              <ErrorMessage name="name" :error="error" />
            </div>
            <div class="space-y-2">
              <Label for="type">Store Type</Label>
              <Skeleton v-if="initLoading" class="w-full h-4" />
              <Select
                id="type"
                v-model="form.type"
                placeholder="Store type"
                v-else
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a store type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="type in types"
                      :key="type.value"
                      :value="type.value"
                      class="cursor-pointer"
                    >
                      {{ type.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ErrorMessage name="type" :error="error" />
            </div>
            <div class="space-y-2">
              <Label for="email">Store email</Label>
              <Skeleton v-if="initLoading" class="w-full h-4" />
              <Input id="email" v-model="form.email" type="email" v-else />
              <ErrorMessage name="email" :error="error" />
            </div>
            <div class="space-y-2">
              <Label for="phone">Store phone</Label>
              <Skeleton v-if="initLoading" class="w-full h-4" />
              <Input id="phone" v-model="form.phone" type="tel" v-else />
              <ErrorMessage name="phone" :error="error" />
            </div>
            <div class="space-y-2">
              <Label for="address">Store address</Label>
              <Skeleton v-if="initLoading" class="w-full h-4" />
              <Input id="address" v-model="form.address" type="text" v-else />
              <ErrorMessage name="address" :error="error" />
            </div>
            <div class="col-span-2 space-y-2">
              <Label for="metaTitle">Store meta title</Label>
              <Skeleton v-if="initLoading" class="w-full h-4" />
              <Input
                id="metaTitle"
                v-model="form.metaTitle"
                type="text"
                v-else
              />
              <ErrorMessage name="metaTitle" :error="error" />
            </div>
            <div class="col-span-2 space-y-2">
              <Label for="metaDescription">Store meta description</Label>
              <Skeleton v-if="initLoading" class="w-full h-10" />
              <Textarea
                id="metaDescription"
                v-model="form.metaDescription"
                type="text"
              />
              <ErrorMessage name="metaDescription" :error="error" />
            </div>
          </div>
          <Button class="mt-5 w-full" @click="updateStore">
            <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
            Update Store information</Button
          >
        </div>
      </div>
      <div class="flex-1 space-y-4">
        <div
          class="lg:col-span-2 bg-white shadow-md rounded-xl py-4 md:px-4 px-2 border"
        >
          <h2 class="text-lg font-bold mb-2">Store URL</h2>
          <ClientOnly>
            <div class="flex justify-center py-2">
              <Skeleton v-if="initLoading" class="w-full h-48" />
              <QRCode
                v-else
                :width="200"
                :height="200"
                :value="storeUrl"
                :qrOptions="{
                  mode: 'Byte',
                  errorCorrectionLevel: 'L',
                }"
                :dotsOptions="{ type: 'square' }"
                :cornersSquareOptions="{ type: 'square', color: '#000000' }"
              />
            </div>
            <div class="relative border rounded-md p-2">
              <p class="truncate pr-8">{{ storeUrl }}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button
                      class="absolute top-1/2 right-3 transform -translate-y-1/2"
                      @click="copyStoreUrl()"
                    >
                      <CopyIcon :size="16" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy Store URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </ClientOnly>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <h2 class="text-2xl font-bold mb-2">Store logo</h2>
          <div
            class="border border-dashed flex items-center justify-center min-h-44 cursor-pointer rounded-xl p-2"
            @click="logoModal = true"
          >
            <ImageIcon v-if="!form.logo" :size="100" />
            <div
              v-else
              class="w-full flex justify-center items-center relative max-h-28"
            >
              <img
                :src="form.logo"
                class="w-full h-28 object-contain drop-shadow-xl rounded-lg"
              />
            </div>
          </div>
          <ErrorMessage name="logo" :error="error" />
        </div>
      </div>
    </div>
  </Dashboard>
  <ImageModal v-model="form.logo" v-model:open="logoModal" />
</template>
<script>
import QRCode from "qrcode-vue3";
import { CopyIcon, ImageIcon, LoaderIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "StoreSettings",
  components: {
    CopyIcon,
    QRCode,
    ImageIcon,
    LoaderIcon,
  },
  data() {
    return {
      form: {
        id: "",
        name: "",
        logo: "",
        type: "",
        email: "",
        phone: "",
        address: "",
        metaTitle: "",
        metaDescription: "",
      },
      types: [
        { value: "Clothing & Apparel", label: "Clothing & Apparel" },
        { value: "Shoes & Footwear", label: "Shoes & Footwear" },
        { value: "Jewelry", label: "Jewelry" },
        { value: "Beauty & Cosmetics", label: "Beauty & Cosmetics" },
        { value: "Electronics & Gadgets", label: "Electronics & Gadgets" },
        { value: "Furniture", label: "Furniture" },
        { value: "Books", label: "Books" },
        { value: "Toys", label: "Toys" },
        { value: "Sports & Outdoors", label: "Sports & Outdoors" },
        { value: "Health", label: "Health" },
        { value: "Food", label: "Food" },
        { value: "Pet", label: "Pet" },
        { value: "Grocery", label: "Grocery" },
        { value: "Pharmaceuticals", label: "Pharmaceuticals" },
        { value: "Utilities", label: "Utilities" },
        { value: "Others", label: "Others" },
      ],
      error: {},
      logoModal: false,
      loading: false,
      initLoading: true,
    };
  },
  computed: {
    storeUrl() {
      return `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/store/${this.form.id}`;
    },
    storeID() {
      return useStore().storeID;
    },
  },
  watch: {
    storeID() {
      this.fetchStore();
    },
  },
  mounted() {
    this.fetchStore();
  },
  methods: {
    async fetchStore() {
      try {
        this.initLoading = true;
        const { api } = useApi();
        const { item } = await api.get("/dashboard/store");
        this.form = { ...this.form, ...item };
      } catch (error) {
        console.error(error);
        if (error.response?._data?.errors) {
          this.error = error.response._data.errors;
        }
      } finally {
        this.initLoading = false;
      }
    },
    async copyStoreUrl() {
      try {
        await navigator.clipboard.writeText(this.storeUrl);
        toast.success("Store URL copied to clipboard");
      } catch (error) {
        console.error(error);
      }
    },
    async updateStore() {
      try {
        this.loading = true;
        const { api } = useApi();
        await api.post("/dashboard/store", this.form);
        toast.success("Store updated successfully");
      } catch (error) {
        console.error(error);
        if (error.response?._data?.errors) {
          this.error = error.response._data.errors;
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
