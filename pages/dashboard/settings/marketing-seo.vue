<template>
  <Head>
    <title>Marketing & SEO - Settings</title>
  </Head>
  <Dashboard>
    <h1 class="text-2xl font-bold">Marketing & SEO Tools</h1>
    <div class="mt-2">
      <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2 border">
        <p class="mb-5 font-bold text-rose-500">
          Note: To set up Google Tag Manager (GTM) or Facebook Pixel, please
          ensure that your shop domain is set up first.
        </p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <img src="/icons/google.svg" />
              <div>
                <p>Sitemaps for Search Engine</p>
                <p class="text-xs">
                  Add sitemaps to 'Google Search Console' to Rank your website.
                </p>
              </div>
            </div>
            <Skeleton v-if="initLoading" class="w-full h-4" />
            <div class="relative border rounded-md p-2" v-else>
              <p class="truncate pr-8">{{ siteMapUrl }}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button
                      class="absolute top-1/2 right-3 transform -translate-y-1/2"
                      @click="copySitemap()"
                    >
                      <CopyIcon :size="16" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy sitemap URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <img src="/icons/facebook.svg" />
              <div>
                <p>Facebook Data Feed</p>
                <p class="text-xs">
                  Add/Upload data feed to the Facebook catalog.
                </p>
              </div>
            </div>
            <Skeleton v-if="initLoading" class="w-full h-4" />
            <div class="relative border rounded-md p-2" v-else>
              <p class="truncate pr-8">{{ fbProductFeedUrl }}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button
                      class="absolute top-1/2 right-3 transform -translate-y-1/2"
                      @click="copyFbProductFeed()"
                    >
                      <CopyIcon :size="16" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy data feed URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <img src="/icons/gtm.svg" />
              <div>
                <p>Google Tag Manager ID</p>
              </div>
            </div>
            <Skeleton v-if="initLoading" class="w-full h-4" />
            <Input
              id="gtm"
              v-else
              v-model="form.gtm"
              type="text"
              placeholder="Google Tag Manager ID"
            />
            <ErrorMessage name="gtm" :error="error" />
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <img src="/icons/analytics.svg" class="size-6" />
              <div>
                <p>Google Analytics ID</p>
              </div>
            </div>
            <Skeleton v-if="initLoading" class="w-full h-4" />
            <Input
              id="analytics"
              v-else
              v-model="form.analytics"
              type="text"
              placeholder="Google Analytics ID"
            />
            <ErrorMessage name="analytics" :error="error" />
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <img src="/icons/pixel.svg" />
              <div>
                <p>Facebook Pixel ID</p>
              </div>
            </div>
            <Skeleton v-if="initLoading" class="w-full h-4" />
            <Input
              id="pixelID"
              v-else
              v-model="form.pixelID"
              type="text"
              placeholder="Facebook Pixel ID"
            />
            <ErrorMessage name="pixelID" :error="error" />
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <img src="/icons/pixel.svg" />
              <div>
                <p>Facebook Pixel Access Token</p>
              </div>
            </div>
            <Skeleton v-if="initLoading" class="w-full h-4" />
            <Input
              id="pixelToken"
              v-else
              v-model="form.pixelToken"
              type="text"
              placeholder="Facebook Pixel Access Token"
            />
            <ErrorMessage name="pixelToken" :error="error" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <div class="flex items-center gap-2">
              <img src="/icons/pixel.svg" />
              <div>
                <p>
                  Facebook Pixel Test Event ID
                  <span class="text-xs"
                    >(Please clear after testing is done)</span
                  >
                </p>
              </div>
            </div>
            <Skeleton v-if="initLoading" class="w-full h-4" />
            <Input
              id="pixelEventID"
              v-else
              v-model="form.pixelEventID"
              type="text"
              placeholder="Facebook Pixel Test Event ID"
            />
            <ErrorMessage name="pixelEventID" :error="error" />
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <Button @click="updateMarketing">
            <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
            Update Marketing information</Button
          >
        </div>
      </div>
    </div>
  </Dashboard>
</template>
<script>
import QRCode from "qrcode-vue3";
import { CopyIcon, ImageIcon, LoaderIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "MarketingSEOSettings",
  components: {
    CopyIcon,
    QRCode,
    ImageIcon,
    LoaderIcon,
  },
  data() {
    return {
      form: {
        gtm: "",
        pixelID: "",
        pixelToken: "",
        pixelEventID: "",
        analytics: "",
      },
      error: {},
      loading: false,
      initLoading: true,
    };
  },
  computed: {
    store() {
      return useStore().selectStore;
    },
    siteMapUrl() {
      return `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/store/${this.store.id}/sitemap.xml`;
    },
    fbProductFeedUrl() {
      return `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/store/${this.store.id}/facebook-product-feed.xml`;
    },
    storeID() {
      return useStore().storeID;
    },
  },
  watch: {
    storeID() {
      this.fetchMarketing();
    },
  },
  mounted() {
    this.fetchMarketing();
  },
  methods: {
    async fetchMarketing() {
      try {
        this.initLoading = true;
        const { api } = useApi();
        const { item } = await api.get("/dashboard/settings/marketing");
        this.form = item;
      } catch (error) {
        console.error(error);
        if (error.response?._data?.errors) {
          this.error = error.response._data.errors;
        }
      } finally {
        this.initLoading = false;
      }
    },
    async copySitemap() {
      try {
        await navigator.clipboard.writeText(this.siteMapUrl);
        toast.success("Sitemap copied to clipboard");
      } catch (error) {
        console.error(error);
      }
    },
    async copyFbProductFeed() {
      try {
        await navigator.clipboard.writeText(this.fbProductFeedUrl);
        toast.success("Facebook product feed copied to clipboard");
      } catch (error) {
        console.error(error);
      }
    },
    async updateMarketing() {
      try {
        this.loading = true;
        const { api } = useApi();
        await api.post("/dashboard/settings/marketing", this.form);
        toast.success("Marketing updated successfully");
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
