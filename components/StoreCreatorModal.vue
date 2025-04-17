<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Create your online store</AlertDialogTitle>
        <AlertDialogDescription class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Store Name</Label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="e.g. My Store"
            />
            <ErrorMessage name="name" :error="error" />
          </div>
          <div class="space-y-2">
            <Label for="name">Store Type</Label>
            <Select v-model="form.type">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a store type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="type in types"
                    :key="type.value"
                    :value="type.value"
                    class="cursor-pointer"
                  >
                    {{ type.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ErrorMessage name="type" :error="error" />
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          v-if="stores && stores.length > 0"
          variant="destructive"
          >Close</AlertDialogCancel
        >
        <Button @click="createStore">
          <LoaderIcon v-if="loading" class="animate-spin" />
          Create</Button
        >
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script>
import eventBus from "@/lib/eventBus";
import { LoaderIcon } from "lucide-vue-next";

export default {
  name: "StoreCreatorModal",
  components: {
    LoaderIcon,
  },
  data() {
    return {
      open: false,
      form: {
        name: "",
        type: "",
      },
      types: [
        { value: "Clothing & Apparel", label: "Clothing & Apparel" },
        { value: "Shoes & Footwear", label: "Shoes & Footwear" },
        { value: "Jewelry", label: "Jewelry" },
        { value: "Beauty & Cosmetics", label: "Beauty & Cosmetics" },
        { value: "Electronics & Gadgets", label: "Electronics & Gadgets" },
        { value: "Furniture", label: "Furniture" },
        { value: "Books", label: "Books" },
        { value: "Toys", label: "Toys" },
        { value: "Sports & Outdoors", label: "Sports & Outdoors" },
        { value: "Health", label: "Health" },
        { value: "Food", label: "Food" },
        { value: "Pet", label: "Pet" },
        { value: "Grocery", label: "Grocery" },
        { value: "Pharmaceuticals", label: "Pharmaceuticals" },
        { value: "Utilities", label: "Utilities" },
        { value: "Others", label: "Others" },
      ],
      loading: false,
      error: {},
    };
  },
  computed: {
    stores() {
      return useStore().stores.value;
    },
    selectStore() {
      return useStore().selectStore;
    },
  },
  watch: {
    open() {
      if (!this.open) {
        this.form = {
          name: "",
          type: "",
        };
        this.error = {};
      }
    },
  },
  mounted() {
    this.open = this.stores && this.stores.length === 0;
    eventBus.on("openStoreCreatorModal", () => {
      this.open = true;
    });
  },
  beforeUnmount() {
    eventBus.off("openStoreCreatorModal");
  },
  methods: {
    async createStore() {
      try {
        this.loading = true;
        const { api } = useApi();
        const store = await api.post("/user/store", this.form);
        const { fetchStores, setSelectStore } = useStore();
        await fetchStores();
        setSelectStore(store._id);
        this.open = false;
      } catch (error) {
        console.error(error);
        if (error.response._data.errors) {
          this.error = error.response._data.errors;
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
