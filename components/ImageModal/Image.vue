<template>
  <form class="flex items-center gap-2" @submit.prevent="fetchSearchImages">
    <Input id="Search" placeholder="Search" v-model="search" class="flex-1" />
    <Button size="icon" type="submit"><SearchIcon /></Button>
  </form>
  <div class="max-h-[500px] overflow-y-auto mt-2">
    <div class="border rounded-lg p-2">
      <div v-if="imageLoading" class="flex justify-center items-center h-36">
        <LoaderIcon class="animate-spin" :size="60" />
      </div>
      <p
        class="text-center py-16 text-2xl font-bold text-black"
        v-else-if="images.length === 0"
      >
        No images found
      </p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div
          v-for="(image, i) in imgs"
          :key="i"
          class="relative border rounded-md p-2"
        >
          <button
            class="relative w-full h-28 rounded-lg overflow-hidden"
            @click="selectImage(i)"
          >
            <div
              class="absolute top-0 left-0 w-full h-full bg-black/70 text-white font-bold flex items-center justify-center text-2xl"
              v-if="checkSelectImage(image.url)"
            >
              <!-- <CheckCircleIcon :size="30" /> -->
              {{ getSn(i) }}
            </div>

            <img :src="image.url" class="size-full object-contain" />
          </button>
          <EditMode
            v-model="imgs[i].name"
            tag="p"
            textClass="truncate"
            class="mt-1 text-center"
            @save="saveImageName(i)"
          />
        </div>
      </div>
    </div>
  </div>
  <Pagination
    v-slot="{ page }"
    :items-per-page="perPage"
    :total="total"
    :sibling-count="1"
    show-edges
    :default-page="page"
    v-if="images && images.length > 0"
  >
    <PaginationList
      v-slot="{ items }"
      class="flex items-center justify-center gap-1 mt-2"
    >
      <PaginationFirst @click="loadPage(1)" />
      <PaginationPrev @click="loadPage(page - 1)" />

      <template v-for="(item, index) in items">
        <PaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
        >
          <Button
            class="w-9 h-9 p-0"
            :variant="item.value === page ? 'default' : 'outline'"
            @click="loadPage(item.value)"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext @click="loadPage(page + 1)" />
      <PaginationLast @click="loadPage(Math.ceil(total / perPage))" />
    </PaginationList>
  </Pagination>
</template>

<script>
import eventBus from "@/lib/eventBus";
import {
  CheckCircleIcon,
  FullscreenIcon,
  LoaderIcon,
  SearchIcon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "ImageModalImage",
  components: {
    SearchIcon,
    LoaderIcon,
    CheckCircleIcon,
    FullscreenIcon,
  },
  props: {
    multiSelect: Boolean,
  },
  data() {
    return {
      imgs: [],
    };
  },
  computed: {
    selectImages: {
      get() {
        return this.$attrs.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    search: {
      get() {
        const { search } = useImg();
        return search.value;
      },
      set(val) {
        const { search } = useImg();
        search.value = val;
      },
    },
    images() {
      const { images } = useImg();
      return images.value || [];
    },
    total() {
      const { total } = useImg();
      return total.value;
    },
    perPage() {
      const { perPage } = useImg();
      return perPage.value;
    },
    page() {
      const { page } = useImg();
      return page.value;
    },
    imageLoading() {
      const { imageLoading } = useImg();
      return imageLoading.value;
    },
    checkSelectImage() {
      return (url) => {
        if (this.multiSelect) {
          return this.selectImages.includes(url);
        } else {
          return this.selectImages === url;
        }
      };
    },
    getSn() {
      return (i) => {
        const { url } = this.imgs[i];
        return this.selectImages.indexOf(url) + 1;
      };
    },
  },
  watch: {
    images() {
      this.imgs = this.images;
    },
  },
  mounted() {
    this.setImage();
    this.fetchImages();
  },
  methods: {
    setImage() {
      this.imgs = this.images;
    },
    async fetchImages() {
      try {
        const { fetchImages } = useImg();
        await fetchImages();
      } catch (error) {
        console.error(error);
      }
    },
    async saveImageName(i) {
      try {
        const image = this.imgs[i];
        if (image) {
          const { api } = useApi();
          await api.post(`/user/image/update-name`, image);
          toast.success("Image name updated successfully");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSearchImages() {
      try {
        const { resetImages } = useImg();
        await resetImages();
      } catch (error) {
        console.error(error);
      }
    },
    selectImage(i) {
      try {
        const { url } = this.imgs[i];
        if (this.multiSelect) {
          if (this.selectImages.includes(url)) {
            this.selectImages = [
              ...this.selectImages.filter((image) => image !== url),
            ];
          } else {
            this.selectImages = [...this.selectImages, url];
          }
        } else {
          this.selectImages = url;
        }
      } catch (error) {
        console.error(error);
      }
    },
    previewImage(url) {
      eventBus.emit("previewImage", [url]);
    },
    loadPage(page) {
      const { loadPage } = useImg();
      loadPage(page);
    },
  },
};
</script>
