<template>
  <Head>
    <Title>Delivery</Title>
  </Head>
  <Dashboard>
    <div class="py-4 md:px-4 px-2">
      <div class="flex justify-between items-center">
        <h1 class="text-lg lg:text-3xl font-bold">Legal pages</h1>
      </div>
      <div class="mt-5 space-y-5">
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <div
            class="flex justify-between items-center cursor-pointer"
            @click="showAbout = !showAbout"
          >
            <h2 class="text-xl font-bold">About us page</h2>
            <ChevronDownIcon
              :class="{ 'rotate-180': showAbout }"
              class="transition-all duration-300"
            />
          </div>
          <SlideUpDown :active="showAbout" :duration="300">
            <div
              v-if="initLoading"
              class="flex justify-center items-center py-20"
            >
              <LoaderIcon class="animate-spin" />
            </div>
            <div class="pt-5" v-else>
              <ClientOnly>
                <TextEditor
                  v-model="form.about"
                  placeholder="Enter about us page content"
                />
              </ClientOnly>
            </div>
          </SlideUpDown>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <div
            class="flex justify-between items-center cursor-pointer"
            @click="showPrivacy = !showPrivacy"
          >
            <h2 class="text-xl font-bold">Privacy policy page</h2>
            <ChevronDownIcon
              :class="{ 'rotate-180': showPrivacy }"
              class="transition-all duration-300"
            />
          </div>
          <SlideUpDown :active="showPrivacy" :duration="300">
            <div
              v-if="initLoading"
              class="flex justify-center items-center py-20"
            >
              <LoaderIcon class="animate-spin" />
            </div>
            <div class="pt-5" v-else>
              <ClientOnly>
                <TextEditor
                  v-model="form.privacy"
                  placeholder="Enter privacy policy page content"
                />
              </ClientOnly>
            </div>
          </SlideUpDown>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <div
            class="flex justify-between items-center cursor-pointer"
            @click="showTerms = !showTerms"
          >
            <h2 class="text-xl font-bold">Terms and conditions page</h2>
            <ChevronDownIcon
              :class="{ 'rotate-180': showTerms }"
              class="transition-all duration-300"
            />
          </div>
          <SlideUpDown :active="showTerms" :duration="300">
            <div
              v-if="initLoading"
              class="flex justify-center items-center py-20"
            >
              <LoaderIcon class="animate-spin" />
            </div>
            <div class="pt-5" v-else>
              <ClientOnly>
                <TextEditor
                  v-model="form.terms"
                  placeholder="Enter terms and conditions page content"
                />
              </ClientOnly>
            </div>
          </SlideUpDown>
        </div>
        <div class="bg-white p-4 shadow-md rounded-xl border">
          <div
            class="flex justify-between items-center cursor-pointer"
            @click="showReturn = !showReturn"
          >
            <h2 class="text-xl font-bold">
              Return and cancellation policy page
            </h2>
            <ChevronDownIcon
              :class="{ 'rotate-180': showReturn }"
              class="transition-all duration-300"
            />
          </div>
          <SlideUpDown :active="showReturn" :duration="300">
            <div
              v-if="initLoading"
              class="flex justify-center items-center py-20"
            >
              <LoaderIcon class="animate-spin" />
            </div>
            <div class="pt-5" v-else>
              <ClientOnly>
                <TextEditor
                  v-model="form.returnPolicy"
                  placeholder="Enter return and cancellation policy page content"
                />
              </ClientOnly>
            </div>
          </SlideUpDown>
        </div>
        <div class="flex justify-end">
          <Button :disabled="loading" @click="submit">
            <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
            Update Legal Pages</Button
          >
        </div>
      </div>
    </div>
  </Dashboard>
</template>

<script>
import { ChevronDownIcon, LoaderIcon } from "lucide-vue-next";
import SlideUpDown from "vue-slide-up-down";
export default {
  name: "LegalPages",
  components: {
    SlideUpDown,
    ChevronDownIcon,
    LoaderIcon,
  },
  data() {
    return {
      showAbout: true,
      showTerms: true,
      showPrivacy: true,
      showReturn: true,
      form: {
        about: "",
        terms: "",
        privacy: "",
        returnPolicy: "",
      },
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
      this.fetchLegalPages();
    },
  },
  mounted() {
    this.fetchLegalPages();
  },
  methods: {
    async fetchLegalPages() {
      try {
        this.initLoading = true;
        const { api } = useApi();
        const { legalPages } = await api.get("/dashboard/legal-pages");
        this.form = legalPages;
      } catch (error) {
        this.$toast.error(error.response.data.message);
      } finally {
        this.initLoading = false;
      }
    },
    async submit() {
      try {
        this.loading = true;
        const { api } = useApi();
        await api.post("/dashboard/legal-pages", this.form);
        this.$toast.success("Legal pages updated successfully");
      } catch (error) {
        this.$toast.error(error.response.data.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
