<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <StoreSwitcher />
    </SidebarHeader>
    <SidebarContent>
      <NavMain />
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

<script setup>
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const props = defineProps({
  side: { type: String, required: false, default: "left" },
  variant: { type: String, required: false, default: "default" },
  collapsible: { type: String, required: false, default: "icon" },
  class: { type: null, required: false, default: "" },
});
</script>
