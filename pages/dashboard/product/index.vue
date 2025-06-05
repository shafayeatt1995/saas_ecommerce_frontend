<template>
  <Head>
    <title>Product</title>
  </Head>
  <Dashboard>
    <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2">
      <div class="flex justify-between items-center mb-5">
        <h1 class="text-lg lg:text-3xl font-bold">Product</h1>
        <NuxtLink
          to="/dashboard/product/create-update"
          :class="cn(buttonVariants({ variant: 'default' }))"
          ><PlusIcon /> Add Product</NuxtLink
        >
      </div>
      <TableResponsive
        :fields="fields"
        :items="initLoading ? 10 : items"
        :skeleton="initLoading"
      >
        <template #empty>
          <div class="w-full flex flex-col justify-center items-center py-10">
            <InboxIcon :size="100" />
            <p class="text-2xl font-bold">No products found</p>
          </div>
        </template>
        <template #thumbnail="{ value }">
          <img :src="value" class="w-full max-h-20 object-contain" />
        </template>
        <template #stock="{ value }">
          <Badge variant="success" v-if="value">In Stock</Badge>
          <Badge variant="destructiveOutline" v-else>Out of Stock</Badge>
        </template>
        <template #status="{ value }">
          <Badge variant="success" v-if="value">Published</Badge>
          <Badge variant="destructiveOutline" v-else>Draft</Badge>
        </template>
        <template #price="{ item }">
          <div>
            <p>
              Price:
              <span v-if="item.discountStatus && item.discountPrice > 0"
                ><del>{{ item.price }}</del>
                {{ item.price - item.discountPrice }}</span
              >
              <span v-else>{{ item.price }}</span>
            </p>
            <p v-if="item.discountStatus && item.discountPrice > 0">
              Discount: {{ item.discountPrice }}
            </p>
          </div>
        </template>
        <template #actions="{ item, index }">
          <div class="flex items-center justify-center gap-2">
            <NuxtLink
              :to="`/dashboard/product/create-update?id=${item._id}`"
              :class="cn(buttonVariants({ variant: 'default' }))"
              >Edit</NuxtLink
            >
            <Button variant="destructive" @click="deleteItem(index)"
              >Delete</Button
            >
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
  </Dashboard>
</template>

<script>
import { buttonVariants } from "@/components/ui/button";
import { useApi } from "@/composables/useApi";
import { cn } from "@/lib/utils";
import { InboxIcon, PlusIcon } from "lucide-vue-next";

export default {
  name: "Store",
  components: {
    PlusIcon,
    InboxIcon,
  },
  data() {
    return {
      items: [],
      total: 0,
      blocked: false,
      initLoading: true,
      perPage: 20,
    };
  },
  computed: {
    page() {
      return this.$route.query.page || 1;
    },
    fields() {
      return [
        { key: "thumbnail", label: "THUMBNAIL", span: "minmax(100px, 1fr)" },
        { key: "name", label: "NAME", span: "minmax(200px, 1fr)" },
        { key: "price", label: "Price", span: "minmax(180px, 1fr)" },
        { key: "stock", label: "Stock", span: "minmax(100px, 1fr)" },
        { key: "status", label: "Status", span: "minmax(100px, 1fr)" },
        { key: "actions", label: "Actions", span: "minmax(100px, 1fr)" },
      ];
    },
    storeID() {
      return useStore().storeID;
    },
  },
  watch: {
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
  },
  methods: {
    cn,
    buttonVariants,
    async fetchItems() {
      try {
        this.initLoading = true;
        const { api } = useApi();
        const { items, total } = await api.get("/dashboard/product", {
          page: this.page,
          perPage: this.perPage,
        });
        this.items = items;
        this.total = total;
      } catch (e) {
        console.error(e);
      } finally {
        this.initLoading = false;
      }
    },
    async deleteItem(i) {
      try {
        if (this.blocked) return;
        if (!confirm("Are you sure you want to delete this product?")) return;
        this.blocked = true;
        const { api } = useApi();
        await api.delete(`/dashboard/product`, {
          id: this.items[i]._id,
        });
        this.fetchItems();
      } catch (e) {
        console.error(e);
      } finally {
        this.blocked = false;
      }
    },
    paginateUrl(page = 1) {
      this.$router.push({
        name: "dashboard-product",
        query: { page },
      });
    },
  },
};
</script>

<style>
.iframe-width iframe {
  width: 100% !important;
  height: 300px !important;
}
</style>
