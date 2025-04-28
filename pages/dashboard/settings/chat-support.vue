<template>
  <Head>
    <title>Chat support - Settings</title>
  </Head>
  <Dashboard>
    <h1 class="text-2xl font-bold">Chat Support</h1>
    <div class="mt-2">
      <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2 border">
        <div class="space-y-2">
          <Label for="whatsapp">Whatsapp number (Ex:- +8801*********) </Label>
          <Input
            id="whatsapp"
            v-model="form.whatsapp"
            type="text"
            placeholder="Enter your whatsapp number with country code. Example: +8801*********"
          />
          <ErrorMessage name="whatsapp" :error="error" />
        </div>
        <div class="flex justify-end mt-5">
          <Button @click="updateMarketing">
            <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
            Update Whatsapp Number</Button
          >
        </div>
      </div>
    </div>
  </Dashboard>
</template>
<script>
import { LoaderIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "ChatSettings",
  components: {
    LoaderIcon,
  },
  data() {
    return {
      form: { whatsapp: "" },
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
        this.form = { whatsapp: item.whatsapp };
      } catch (error) {
        console.error(error);
        if (error.response?._data?.errors) {
          this.error = error.response._data.errors;
        }
      } finally {
        this.initLoading = false;
      }
    },
    async updateMarketing() {
      try {
        this.loading = true;
        const { api } = useApi();
        await api.post("/dashboard/settings/whatsapp", this.form);
        toast.success("Whatsapp number updated successfully");
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
