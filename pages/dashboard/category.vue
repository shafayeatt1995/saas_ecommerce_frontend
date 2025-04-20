<template>
  <Head>
    <Title>Category</Title>
  </Head>
  <Dashboard>
    <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2">
      <div class="flex justify-between items-center">
        <h1 class="text-lg lg:text-3xl font-bold">Category</h1>
        <Button @click="open = true"><PlusIcon />Add Category</Button>
      </div>
      <div class="mt-5">
        <TableResponsive
          :fields="fields"
          :items="initLoading ? 10 : items"
          :skeleton="initLoading"
        >
          <template #empty>
            <div class="w-full flex flex-col justify-center items-center py-10">
              <InboxIcon :size="100" />
              <p class="text-2xl font-bold">No categories found</p>
            </div>
          </template>
          <template #image="{ value }">
            <div
              v-if="value"
              class="flex justify-end md:justify-start items-center"
            >
              <img :src="value" class="w-full h-20 object-contain rounded-lg" />
            </div>
            <div v-else>
              <ImageIcon :size="100" />
            </div>
          </template>
          <template #actions="{ item }">
            <div class="flex gap-2">
              <Button variant="outline" @click="editCategory(item)">
                <PencilIcon /> Edit
              </Button>
              <Button variant="destructive" @click="deleteCategory(item)">
                <Trash2Icon /> Delete
              </Button>
            </div>
          </template>
        </TableResponsive>
        <div
          v-if="!initLoading && items.length > 0"
          class="flex justify-center items-center mt-5"
        >
          <Pagination
            v-slot="{ page }"
            :items-per-page="perPage"
            :total="total"
            :sibling-count="1"
            show-edges
            :default-page="+page"
          >
            <PaginationList
              v-slot="{ items }"
              class="flex items-center justify-center gap-1 mt-2"
            >
              <PaginationFirst @click="paginateUrl(1)" />
              <PaginationPrev @click="paginateUrl(+page - 1)" />

              <template v-for="(item, index) in items">
                <PaginationListItem
                  v-if="item.type === 'page'"
                  :key="index"
                  :value="item.value"
                  as-child
                >
                  <Button
                    class="w-9 h-9 p-0"
                    :variant="item.value == page ? 'default' : 'outline'"
                    @click="paginateUrl(item.value)"
                  >
                    {{ item.value }}
                  </Button>
                </PaginationListItem>
                <PaginationEllipsis v-else :key="item.type" :index="index" />
              </template>

              <PaginationNext @click="paginateUrl(+page + 1)" />
              <PaginationLast
                @click="paginateUrl(items[items.length - 1].value)"
              />
            </PaginationList>
          </Pagination>
        </div>
      </div>
    </div>
  </Dashboard>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ editMode ? "Edit" : "Add" }} Category</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Category name</Label>
          <Input id="name" v-model="form.name" placeholder="Category Name" />
          <ErrorMessage name="name" :error="error" />
        </div>
        <div class="space-y-2">
          <Label for="image">Category image</Label>
          <div
            class="border border-dashed flex items-center justify-center min-h-44 cursor-pointer rounded-xl p-2"
            @click="imageModal = true"
          >
            <ImageIcon v-if="form.image === ''" :size="100" />
            <div v-else class="flex justify-center items-center">
              <img
                :src="form.image"
                class="w-full max-h-60 object-contain drop-shadow-xl rounded-lg"
              />
            </div>
          </div>
          <ErrorMessage name="image" :error="error" />
        </div>
      </div>
      <DialogFooter>
        <Button :disabled="loading" @click="submit">
          <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
          {{ editMode ? "Update" : "Create" }} category
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <ImageModal v-model="form.image" v-model:open="imageModal" />
</template>

<script>
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  InboxIcon,
  LoaderIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-vue-next";

export default {
  name: "CategoryPage",
  components: {
    PlusIcon,
    ImageIcon,
    PencilIcon,
    Trash2Icon,
    LoaderIcon,
    InboxIcon,
  },
  data() {
    return {
      loading: false,
      open: false,
      initLoading: true,
      imageModal: false,
      editMode: false,
      form: {
        name: "",
        image: "",
      },
      items: [],
      total: 0,
      error: {},
      perPage: 20,
    };
  },
  computed: {
    fields() {
      return [
        { key: "name", label: "NAME", span: "minmax(100PX, 1fr)" },
        { key: "image", label: "IMAGE", span: "minmax(100PX, 1fr)" },
        { key: "actions", label: "Actions", span: "minmax(100PX, 1fr)" },
      ];
    },
    page() {
      return this.$route.query.page || 1;
    },
    storeID() {
      return useStore().storeID;
    },
  },
  watch: {
    open(value) {
      if (!value) {
        this.form = {
          name: "",
          image: "",
        };
        this.error = {};
        this.editMode = false;
        this.imageModal = false;
      }
    },
    page() {
      this.fetchItems();
    },
    storeID() {
      if (this.page == 1) {
        this.fetchItems();
      } else {
        this.paginateUrl(1);
      }
    },
  },
  mounted() {
    this.fetchItems();
    this.trigger();
  },
  methods: {
    cn,
    buttonVariants,
    async fetchItems() {
      this.initLoading = true;
      try {
        const { api } = useApi();
        const { items, total } = await api.get("/dashboard/category", {
          page: this.page,
          perPage: this.perPage,
        });
        this.items = items;
        this.total = total;
      } catch (error) {
        console.error(error);
      } finally {
        this.initLoading = false;
      }
    },
    async submit() {
      this.loading = true;
      try {
        const { api } = useApi();
        if (this.editMode) {
          await api.put("/dashboard/category", this.form);
        } else {
          await api.post("/dashboard/category", this.form);
        }
        this.fetchItems();
        this.open = false;
      } catch (error) {
        console.error(error);
        if (error.response?._data?.errors) {
          this.error = error.response._data.errors;
        }
      } finally {
        this.loading = false;
      }
    },
    async editCategory(item) {
      this.form = { ...item };
      this.editMode = true;
      this.open = true;
    },
    async deleteCategory(item) {
      try {
        if (!confirm("Are you sure you want to delete this category?")) return;
        this.loading = true;
        const { api } = useApi();
        await api.delete("/dashboard/category", {
          _id: item._id,
        });
        this.fetchItems();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    paginateUrl(page = 1) {
      this.$router.push({
        name: "dashboard-category",
        query: { page },
      });
    },
    async trigger() {
      try {
        const { api } = useApi();
        await api.get2("/");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
