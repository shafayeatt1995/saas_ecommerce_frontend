<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <component :is="activeShop.logo" class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ activeShop.name }}
              </span>
              <span class="truncate text-xs">{{ activeShop.plan }}</span>
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
            Shops
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(shop, index) in shops"
            :key="shop.name"
            class="gap-2 p-2 cursor-pointer"
            @click="active = index"
          >
            <div
              class="flex size-6 items-center justify-center rounded-sm border"
            >
              <component :is="shop.logo" class="size-3.5 shrink-0" />
            </div>
            {{ shop.name }}
            <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2 cursor-pointer">
            <div
              class="flex size-6 items-center justify-center rounded-md border bg-transparent"
            >
              <PlusIcon class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">Add shop</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
<script>
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, PlusIcon, Store } from "lucide-vue-next";

export default {
  name: "ShopSwitcher",
  components: {
    PlusIcon,
    ChevronsUpDownIcon,
  },
  data() {
    return {
      shops: [
        {
          name: "Acme Inc",
          logo: Store,
          plan: "Enterprise",
        },
        {
          name: "Acme Corp.",
          logo: Store,
          plan: "Startup",
        },
        {
          name: "Evil Corp.",
          logo: Store,
          plan: "Free",
        },
      ],
      active: 0,
    };
  },
  computed: {
    isMobile() {
      return useSidebar().isMobile;
    },
    activeShop() {
      return this.shops[this.active];
    },
  },
};
</script>
