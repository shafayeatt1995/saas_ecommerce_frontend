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
        v-else-if="images && images.length === 0"
      >
        No images found
      </p>
      <div class="grid grid-cols-4 gap-2">
        <div
          v-for="(image, i) in images"
          :key="i"
          class="relative border rounded-md p-2"
        >
          <button
            class="relative w-full h-28 rounded-lg overflow-hidden"
            @click="selectImage(i)"
          >
            <div
              class="absolute top-0 left-0 w-full h-full bg-black/70 text-green-500 flex items-center justify-center"
              v-if="checkSelectImage(image.key)"
            >
              <CheckCircleIcon :size="30" />
            </div>
            <img :src="image.url" class="size-full object-contain" />
          </button>
          <div class="flex items-center justify-center gap-1">
            <p class="mt-1 text-center truncate flex-1">{{ image.name }}</p>
            <p class="">({{ showSize(image.size) }})</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="flex justify-between items-center"
    v-if="images && images.length > 0"
  >
    <Pagination
      v-slot="{ page }"
      :items-per-page="perPage"
      :total="total"
      :sibling-count="1"
      show-edges
      :default-page="page"
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
    <Button
      @click="deleteImages"
      variant="destructive"
      :disabled="selected.length === 0 || deleteLoading"
    >
      <LoaderIcon v-if="deleteLoading" class="animate-spin" :size="20" />
      <Trash2Icon v-else />
      Delete
    </Button>
  </div>
</template>

<script>
import {
  CheckCircleIcon,
  FullscreenIcon,
  LoaderIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "ImageModalDelete",
  components: {
    SearchIcon,
    LoaderIcon,
    CheckCircleIcon,
    FullscreenIcon,
    Trash2Icon,
    LoaderIcon,
  },
  data() {
    return {
      selected: [],
    };
  },
  computed: {
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
      return (key) => this.selected.includes(key);
    },
    deleteLoading() {
      const { deleteLoading } = useImg();
      return deleteLoading.value;
    },
    showSize() {
      return (size) => {
        const kb = size / 1024;
        if (kb < 1) {
          return `${size} bytes`;
        }
        if (kb < 1024) {
          return `${kb.toFixed(0)} KB`;
        }
        return `${(kb / 1024).toFixed(1)} MB`;
      };
    },
  },
  watch: {
    images() {
      this.imgs = this.images;
    },
    search() {
      this.selected = [];
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
        const { key } = this.images[i];
        if (this.selected.includes(key)) {
          this.selected = this.selected.filter((image) => image !== key);
        } else {
          this.selected.push(key);
        }
      } catch (error) {
        console.error(error);
      }
    },
    loadPage(page) {
      const { loadPage } = useImg();
      loadPage(page);
    },
    async deleteImages() {
      try {
        if (!confirm("Are you sure you want to delete these images?")) return;
        const { deleteImages } = useImg();
        await deleteImages(this.selected);
        toast.success("Images deleted successfully");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
