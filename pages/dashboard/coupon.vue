<template>
  <Head>
    <Title>Coupon</Title>
  </Head>
  <Dashboard>
    <div class="bg-white shadow-md rounded-xl py-4 md:px-4 px-2">
      <div class="flex justify-between items-center">
        <h1 class="text-lg lg:text-3xl font-bold">Coupon</h1>
        <Button @click="open = true"><PlusIcon />Add Coupon</Button>
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
              <p class="text-2xl font-bold">No coupons found</p>
            </div>
          </template>
          <template #type="{ item }">
            <div>
              <div class="flex gap-1">
                <p class="capitalize">{{ item.type }}</p>
                <p>-></p>
                <p v-if="item.type === 'amount'">
                  {{ item.discountAmount }}
                </p>
                <p v-else>{{ item.discountPercent }}%</p>
              </div>
              <p>
                Max discount:
                {{ item.maxDiscount ? item.maxDiscountAmount : "N/A" }}
              </p>
              <p>
                Min purchase:
                {{ item.minPurchase ? item.minPurchaseAmount : "N/A" }}
              </p>
            </div>
          </template>
          <template #expireDate="{ item }">
            <p>{{ normalDate(item.expireDate) }}</p>
          </template>
          <template #status="{ value, item }">
            <Switch :defaultValue="value" @click="updateStatus(item)" />
          </template>
          <template #actions="{ item }">
            <div class="flex gap-2">
              <Button variant="outline" @click="editCoupon(item)">
                <PencilIcon /> Edit
              </Button>
              <Button variant="destructive" @click="deleteCoupon(item)">
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
        <DialogTitle>{{ editMode ? "Edit" : "Add" }} Coupon</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="code">Coupon code</Label>
          <Input id="code" v-model="form.code" placeholder="Coupon Code" />
          <ErrorMessage name="code" :error="error" />
        </div>
        <div class="space-y-2">
          <Label for="type">Discount type</Label>
          <Select id="type" v-model="form.type" placeholder="Discount type">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="amount"> Amount </SelectItem>
                <SelectItem value="percent"> Percent </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <ErrorMessage name="type" :error="error" />
          <div v-if="form.type === 'amount'" class="mt-2">
            <Input
              id="discount"
              v-model="form.discountAmount"
              type="number"
              placeholder="Enter discount amount"
              class="w-full"
            />
            <ErrorMessage name="discountAmount" :error="error" />
          </div>
          <div v-if="form.type === 'percent'" class="mt-2">
            <Input
              id="discount"
              v-model="form.discountPercent"
              type="number"
              placeholder="Enter discount percentage 0 to 100"
              class="w-full"
            />
            <ErrorMessage name="discountPercent" :error="error" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center gap-5">
            <Label
              for="maxDiscount"
              class="flex-1 text-lg font-bold cursor-pointer flex items-center"
            >
              Max discount
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <InfoIcon :size="15" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Apply the highest available discount on eligible
                      purchases.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Switch id="maxDiscount" v-model="form.maxDiscount" />
          </div>
          <VueSlideUpDown :active="form.maxDiscount" :duration="300">
            <div class="space-y-2">
              <Label for="maxDiscountAmount">Max discount amount</Label>
              <Input
                id="maxDiscountAmount"
                v-model="form.maxDiscountAmount"
                type="number"
                placeholder="Enter max discount amount"
                class="w-full"
              />
            </div>
            <ErrorMessage name="maxDiscountAmount" :error="error" />
          </VueSlideUpDown>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center gap-5">
            <Label
              for="minPurchase"
              class="flex-1 text-lg font-bold cursor-pointer flex items-center"
            >
              Min purchase
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <InfoIcon :size="15" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Set a minimum purchase requirement for discounts to apply.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Switch id="minPurchase" v-model="form.minPurchase" />
          </div>
          <VueSlideUpDown :active="form.minPurchase" :duration="300">
            <div class="space-y-2">
              <Label for="minPurchaseAmount">Min purchase amount</Label>
              <Input
                id="minPurchaseAmount"
                v-model="form.minPurchaseAmount"
                type="number"
                placeholder="Enter min purchase amount"
                class="w-full"
              />
            </div>
            <ErrorMessage name="minPurchaseAmount" :error="error" />
          </VueSlideUpDown>
        </div>
        <div class="space-y-2">
          <Label for="expireDate">Coupon expire date</Label>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="
                  cn(
                    'w-full justify-start text-left font-normal',
                    !form.expireDate && 'text-muted-foreground'
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{
                  form.expireDate ? normalDate(form.expireDate) : "Pick a date"
                }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="form.expireDate" initial-focus />
            </PopoverContent>
          </Popover>
          <ErrorMessage name="expireDate" :error="error" />
        </div>
      </div>
      <DialogFooter>
        <Button :disabled="loading" @click="submit">
          <LoaderIcon v-if="loading" class="mr-2 animate-spin" />
          {{ editMode ? "Update" : "Create" }} coupon
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <ImageModal v-model="form.image" v-model:open="imageModal" />
</template>

<script>
import VueSlideUpDown from "vue-slide-up-down";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ImageIcon,
  InboxIcon,
  InfoIcon,
  LoaderIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

export default {
  name: "CouponPage",
  components: {
    PlusIcon,
    ImageIcon,
    PencilIcon,
    Trash2Icon,
    LoaderIcon,
    InboxIcon,
    InfoIcon,
    CalendarIcon,
    VueSlideUpDown,
  },
  data() {
    return {
      loading: false,
      open: false,
      initLoading: true,
      imageModal: false,
      editMode: false,
      form: {
        code: "",
        type: "amount",
        discountAmount: 0,
        discountPercent: 0,
        maxDiscount: false,
        maxDiscountAmount: 0,
        minPurchase: false,
        minPurchaseAmount: 0,
        expireDate: null,
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
        { key: "code", label: "CODE", span: "minmax(100PX, 1fr)" },
        { key: "type", label: "TYPE", span: "minmax(100PX, 1fr)" },
        { key: "expireDate", label: "EXPIRE DATE", span: "minmax(100PX, 1fr)" },
        { key: "status", label: "STATUS", span: "minmax(100PX, 1fr)" },
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
          code: "",
          type: "amount",
          discountAmount: 0,
          discountPercent: 0,
          maxDiscount: false,
          maxDiscountAmount: 0,
          minPurchase: false,
          minPurchaseAmount: 0,
          expireDate: null,
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
    "form.type"(val) {
      if (val === "amount") {
        this.form.discountPercent = 0;
      } else {
        this.form.discountAmount = 0;
      }
    },
    "form.maxDiscount"(val) {
      if (!val) this.form.maxDiscountAmount = "";
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
        const { items, total } = await api.get("/dashboard/coupon", {
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
        const body = {
          ...this.form,
          expireDate: this.form.expireDate
            ? new Date(this.form.expireDate)
            : null,
        };
        if (this.editMode) {
          await api.put("/dashboard/coupon", body);
        } else {
          await api.post("/dashboard/coupon", body);
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
    async editCoupon(item) {
      this.form = { ...item };
      this.editMode = true;
      this.open = true;
    },
    async deleteCoupon(item) {
      try {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        this.loading = true;
        const { api } = useApi();
        await api.delete("/dashboard/coupon", {
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
        name: "dashboard-coupon",
        query: { page },
      });
    },
    normalDate(value) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(value));
    },
    async updateStatus(name) {
      try {
        this.loading = true;
        const { api } = useApi();
        await api.post("/dashboard/coupon/toggle-status", { name });
        toast.success("Status changed successfully");
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
