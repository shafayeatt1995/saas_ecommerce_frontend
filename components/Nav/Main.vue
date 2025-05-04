<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
    <SidebarMenu>
      <template v-for="(item, i) in items" :key="i">
        <Collapsible
          v-if="item.title"
          as-child
          :default-open="item.isActive"
          class="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton :tooltip="item.title">
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <ChevronRight
                  class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem
                  v-for="subItem in item.items"
                  :key="subItem.title"
                >
                  <SidebarMenuSubButton as-child>
                    <a :href="subItem.url">
                      <span>{{ subItem.title }}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        <SidebarMenuItem v-else>
          <SidebarMenuButton
            as-child
            :class="
              i === 0
                ? currentUrl === item.url
                  ? 'bg-gray-800 text-white hover:bg-gray-800 hover:text-white'
                  : ''
                : currentUrl.startsWith(item.url)
                ? 'bg-gray-800 text-white hover:bg-gray-800 hover:text-white'
                : ''
            "
          >
            <NuxtLink :to="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.name }}</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </template>
    </SidebarMenu>
  </SidebarGroup>
  <SidebarGroup>
    <SidebarGroupLabel>Settings</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible
        v-for="item in navMain"
        :key="item.title"
        as-child
        :default-open="item.isActive"
        class="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.title">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem
                v-for="subItem in item.items"
                :key="subItem.title"
              >
                <SidebarMenuSubButton
                  as-child
                  :class="
                    currentUrl === subItem.url
                      ? 'bg-gray-800 text-white hover:bg-gray-800 hover:text-white'
                      : ''
                  "
                >
                  <NuxtLink :to="subItem.url">
                    <component
                      :is="subItem.icon"
                      v-if="subItem.icon"
                      :class="currentUrl === subItem.url ? ' stroke-white' : ''"
                    />
                    <span class="">{{ subItem.title }}</span>
                  </NuxtLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
<script>
import {
  ChevronRight,
  Settings2,
  MoreHorizontal,
  LayoutDashboard,
  Truck,
  FileText,
  TicketPercent,
  Store,
  DollarSign,
  Grid2x2Plus,
  Package,
  Megaphone,
  MessageSquareMore,
  Share2,
} from "lucide-vue-next";
import { useSidebar } from "../ui/sidebar";
export default {
  name: "NavMain",
  components: {
    ChevronRight,
    MoreHorizontal,
  },
  data() {
    return {
      items: [
        {
          name: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Category",
          url: "/dashboard/category",
          icon: Grid2x2Plus,
        },
        {
          name: "Sub-Category",
          url: "/dashboard/sub-category",
          icon: Grid2x2Plus,
        },
        {
          name: "Product",
          url: "/dashboard/product",
          icon: Package,
        },
        {
          name: "Delivery",
          url: "/dashboard/delivery",
          icon: Truck,
        },
        {
          name: "Coupon",
          url: "/dashboard/coupon",
          icon: TicketPercent,
        },
        {
          name: "Legal pages",
          url: "/dashboard/legal-pages",
          icon: FileText,
        },
      ],
      navMain: [
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          isActive: this.$route.path.startsWith("/dashboard/settings") || false,
          items: [
            {
              title: "Store",
              url: "/dashboard/settings/store",
              icon: Store,
            },
            {
              title: "Payment",
              url: "/dashboard/settings/payment",
              icon: DollarSign,
            },
            {
              title: "Marketing & SEO",
              url: "/dashboard/settings/marketing-seo",
              icon: Megaphone,
            },
            {
              title: "Chat Support",
              url: "/dashboard/settings/chat-support",
              icon: MessageSquareMore,
            },
            {
              title: "Social Links",
              url: "/dashboard/settings/social-links",
              icon: Share2,
            },
          ],
        },
      ],
    };
  },
  computed: {
    isMobile() {
      return useSidebar().isMobile;
    },
    currentUrl() {
      return this.$route.path;
    },
  },
};
</script>
