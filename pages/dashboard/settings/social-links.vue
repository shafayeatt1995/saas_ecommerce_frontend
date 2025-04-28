<template>
  <Head>
    <title>Social Links - Settings</title>
  </Head>
  <Dashboard>
    <h1 class="text-2xl font-bold">Social Links</h1>
    <div class="mt-2">
      <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2 border">
        <div class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="facebook">Facebook</Label>
            <Input
              id="facebook"
              v-model="form.facebook"
              type="text"
              placeholder="https://www.facebook.com/my-store"
            />
            <ErrorMessage name="facebook" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="instagram">Instagram</Label>
            <Input
              id="instagram"
              v-model="form.instagram"
              type="text"
              placeholder="https://www.instagram.com/my-store"
            />
            <ErrorMessage name="instagram" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="linkedin">Linkedin</Label>
            <Input
              id="linkedin"
              v-model="form.linkedin"
              type="text"
              placeholder="https://www.linkedin.com/my-store"
            />
            <ErrorMessage name="linkedin" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="twitter">Twitter</Label>
            <Input
              id="twitter"
              v-model="form.twitter"
              type="text"
              placeholder="https://www.twitter.com/my-store"
            />
            <ErrorMessage name="twitter" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="youtube">Youtube</Label>
            <Input
              id="youtube"
              v-model="form.youtube"
              type="text"
              placeholder="https://www.youtube.com/my-store"
            />
            <ErrorMessage name="youtube" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="tiktok">Tiktok</Label>
            <Input
              id="tiktok"
              v-model="form.tiktok"
              type="text"
              placeholder="https://www.tiktok.com/my-store"
            />
            <ErrorMessage name="tiktok" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="discord">Discord</Label>
            <Input
              id="discord"
              v-model="form.discord"
              type="text"
              placeholder="https://www.discord.com/my-store"
            />
            <ErrorMessage name="discord" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="telegram">Telegram</Label>
            <Input
              id="telegram"
              v-model="form.telegram"
              type="text"
              placeholder="https://www.telegram.com/my-store"
            />
            <ErrorMessage name="telegram" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="daraz">Daraz</Label>
            <Input
              id="daraz"
              v-model="form.daraz"
              type="text"
              placeholder="https://www.daraz.com/my-store"
            />
            <ErrorMessage name="daraz" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="amazon">Amazon</Label>
            <Input
              id="amazon"
              v-model="form.amazon"
              type="text"
              placeholder="https://www.amazon.com/my-store"
            />
            <ErrorMessage name="amazon" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="walmart">Walmart</Label>
            <Input
              id="walmart"
              v-model="form.walmart"
              type="text"
              placeholder="https://www.walmart.com/my-store"
            />
            <ErrorMessage name="walmart" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="snapchat">Snapchat</Label>
            <Input
              id="snapchat"
              v-model="form.snapchat"
              type="text"
              placeholder="https://www.snapchat.com/my-store"
            />
            <ErrorMessage name="snapchat" :error="error" />
          </div>
        </div>
        <div class="flex justify-end mt-5">
          <Button @click="updateMarketing">
            <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
            Update Social Links</Button
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
      form: {
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
        youtube: "",
        tiktok: "",
        discord: "",
        telegram: "",
        daraz: "",
        amazon: "",
        walmart: "",
        snapchat: "",
      },
      error: {},
      loading: false,
      initLoading: true,
    };
  },
  computed: {
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
        this.form = item.socialLinks;
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
        this.error = {};
        const { api } = useApi();
        await api.post("/dashboard/settings/social-links", this.form);
        toast.success("Social links updated successfully");
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
