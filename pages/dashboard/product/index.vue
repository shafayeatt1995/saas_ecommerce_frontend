<template>
  <Admin>
    <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2">
      <div class="flex justify-between items-center mb-5">
        <h1 class="text-lg lg:text-3xl font-bold">Product</h1>
        <NuxtLink
          to="/admin/product/create-update"
          :class="cn(buttonVariants({ variant: 'default' }))"
          ><PlusIcon /> Add Product</NuxtLink
        >
      </div>
      <TableResponsive
        :fields="fields"
        :items="initLoading ? 10 : items"
        :skeleton="initLoading"
      >
        <template #images="{ value }">
          <img :src="value[0]" class="w-full max-h-20 object-contain" />
        </template>
        <template #category="{ value, item }">
          {{ value.name }} -> {{ item?.subCategory?.name }}
        </template>
        <template #price="{ item }">
          <div>
            <p>Dealing Price: {{ item.dealingPrice }}</p>
            <p>Commission: {{ item.commission }}</p>
            <p v-if="item.discountStatus && item.discount > 0">
              Discount: {{ item.discount }}
            </p>
            <p>
              Price:
              <span v-if="item.discountStatus && item.discount > 0"
                ><del>{{ item.price }}</del>
                {{ item.price - item.discount }}</span
              >
              <span v-else>{{ item.price }}</span>
            </p>
          </div>
        </template>
        <template #actions="{ item, index }">
          <div class="flex items-center justify-center gap-2">
            <NuxtLink
              :to="`/admin/product/create-update?id=${item._id}`"
              :class="cn(buttonVariants({ variant: 'default' }))"
              >Edit</NuxtLink
            >
            <Button variant="destructive" @click="deleteItem(index)"
              >Delete</Button
            >
          </div>
        </template>
      </TableResponsive>
      <div class="flex justify-center items-center mt-5">
        <Pagination
          v-slot="{ page }"
          :items-per-page="perPage"
          :total="total"
          :sibling-count="1"
          show-edges
          :default-page="page"
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <NuxtLink
                  class="w-9 h-9 p-0"
                  :class="
                    cn(
                      buttonVariants({
                        variant: item.value == page ? 'default' : 'outline',
                      })
                    )
                  "
                  :to="{ name: 'admin-category', query: { page: item.value } }"
                >
                  {{ item.value }}
                </NuxtLink>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext />
            <PaginationLast />
          </PaginationList>
        </Pagination>
      </div>
    </div>
  </Admin>
</template>

<script>
import { buttonVariants } from "@/components/ui/button";
import { useApi } from "@/composables/useApi";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon, PlusIcon } from "lucide-vue-next";

export default {
  name: "Store",
  components: {
    PlusIcon,
    LoaderCircleIcon,
  },
  data() {
    return {
      items: [],
      total: 0,
      blocked: false,
      initLoading: false,
      perPage: 20,
    };
  },
  computed: {
    page() {
      return this.$route.query.page || 1;
    },
    fields() {
      return [
        { key: "images", label: "IMAGE", span: "minmax(100px, 1fr)" },
        { key: "name", label: "NAME", span: "minmax(200px, 1fr)" },
        { key: "category", label: "CATEGORY", span: "minmax(200px, 1fr)" },
        { key: "price", label: "Price", span: "minmax(200px, 1fr)" },
        { key: "actions", label: "Actions", span: "minmax(100px, 1fr)" },
      ];
    },
  },
  watch: {
    page() {
      this.fetchItems();
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
        const { items, total } = await api.get("/admin/product", {
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
        await api.delete(`/admin/product`, this.items[i]);
        this.fetchItems();
      } catch (e) {
        console.error(e);
      } finally {
        this.blocked = false;
      }
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
