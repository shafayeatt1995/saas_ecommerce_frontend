<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <StoreIcon class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ activeStore?.name || "Select a store" }}
              </span>
              <span class="truncate text-xs">{{
                activeStore ? (activeStore.isExpired ? "Free" : "Paid") : "N/A"
              }}</span>
            </div>
            <ChevronsUpDownIcon class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Stores
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(store, index) in stores"
            :key="store.name"
            class="gap-2 p-2 cursor-pointer"
            @click="selectStore(store)"
          >
            <div
              class="flex size-6 items-center justify-center rounded-sm border"
            >
              <StoreIcon class="size-3.5 shrink-0" />
            </div>
            {{ store.name }}
            <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="gap-2 p-2 cursor-pointer"
            @click="openStoreCreatorModal"
          >
            <div
              class="flex size-6 items-center justify-center rounded-md border bg-transparent"
            >
              <PlusIcon class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">Add store</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
<script>
import { useSidebar } from "@/components/ui/sidebar";
import eventBus from "@/lib/eventBus";
import { ChevronsUpDownIcon, PlusIcon, StoreIcon } from "lucide-vue-next";

export default {
  name: "StoreSwitcher",
  components: {
    PlusIcon,
    ChevronsUpDownIcon,
    StoreIcon,
  },
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    isMobile() {
      return useSidebar().isMobile;
    },
    activeStore() {
      return useStore().selectStore;
    },
    stores() {
      return useStore().stores.value;
    },
  },
  methods: {
    openStoreCreatorModal() {
      eventBus.emit("openStoreCreatorModal");
    },
    selectStore({ _id }) {
      const { setSelectStore } = useStore();
      setSelectStore(_id);
    },
  },
};
</script>
