<template>
  <Head>
    <Title>Delivery</Title>
  </Head>
  <Dashboard>
    <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2">
      <div class="flex justify-between items-center">
        <h1 class="text-lg lg:text-3xl font-bold">Delivery</h1>
        <Button @click="open = true"><PlusIcon />Add Delivery</Button>
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
              <p class="text-2xl font-bold">No delivery found</p>
            </div>
          </template>
          <template #actions="{ item }">
            <div class="flex gap-2">
              <Button variant="outline" @click="editDelivery(item)">
                <PencilIcon /> Edit
              </Button>
              <Button variant="destructive" @click="deleteDelivery(item)">
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
        <DialogTitle>{{ editMode ? "Edit" : "Add" }} Delivery</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="address">Delivery address</Label>
          <Input
            id="address"
            v-model="form.address"
            placeholder="Delivery Address"
          />
          <ErrorMessage name="address" :error="error" />
        </div>
        <div class="space-y-2">
          <Label for="charge">Delivery charge</Label>
          <Input
            id="charge"
            v-model="form.charge"
            type="number"
            placeholder="Delivery Charge"
          />
          <ErrorMessage name="charge" :error="error" />
        </div>
      </div>
      <DialogFooter>
        <Button :disabled="loading" @click="submit">
          <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
          {{ editMode ? "Update" : "Create" }} delivery
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
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
      editMode: false,
      form: {
        address: "",
        charge: 0,
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
        { key: "address", label: "ADDRESS", span: "minmax(100PX, 1fr)" },
        { key: "charge", label: "CHARGE", span: "minmax(100PX, 1fr)" },
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
          address: "",
          charge: 0,
        };
        this.error = {};
        this.editMode = false;
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
  },
  methods: {
    cn,
    buttonVariants,
    async fetchItems() {
      this.initLoading = true;
      try {
        const { api } = useApi();
        const { items, total } = await api.get("/dashboard/delivery", {
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
          await api.put("/dashboard/delivery", this.form);
        } else {
          await api.post("/dashboard/delivery", this.form);
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
    async editDelivery(item) {
      this.form = { ...item };
      this.editMode = true;
      this.open = true;
    },
    async deleteDelivery(item) {
      try {
        if (!confirm("Are you sure you want to delete this delivery?")) return;
        this.loading = true;
        const { api } = useApi();
        await api.delete("/dashboard/delivery", {
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
        name: "dashboard-delivery",
        query: { page },
      });
    },
  },
};
</script>
