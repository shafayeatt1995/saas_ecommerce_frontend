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
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
    </SidebarMenu>
  </SidebarGroup>
</template>
<script>
import {
  ChevronRight,
  Settings2,
  MoreHorizontal,
  LayoutDashboard,
  LayoutGrid,
  Boxes,
  Truck,
  FileText,
  TicketPercent,
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
          icon: LayoutGrid,
        },
        {
          name: "Product",
          url: "/dashboard/product",
          icon: Boxes,
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
        {
          title: "Playground",
          url: "#",
          icon: Boxes,
          isActive: false,
          items: [
            {
              title: "Starred",
              url: "#",
            },
            {
              title: "Settings",
              url: "#",
            },
          ],
        },
      ],
      navMain: [
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          items: [
            {
              title: "General",
              url: "#",
            },
            {
              title: "Team",
              url: "#",
            },
            {
              title: "Billing",
              url: "#",
            },
            {
              title: "Limits",
              url: "#",
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
