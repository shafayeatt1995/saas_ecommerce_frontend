<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <ClientOnly>
            <Breadcrumb>
              <BreadcrumbList>
                <template v-for="(url, index) in urls" :key="index">
                  <BreadcrumbItem v-if="index + 1 === urls.length">
                    <BreadcrumbPage class="capitalize">{{
                      url
                    }}</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbItem v-else class="hidden md:block">
                    <BreadcrumbLink>
                      <NuxtLink
                        :to="`/${urls.slice(0, index + 1).join('/')}`"
                        class="capitalize"
                        >{{ url }}</NuxtLink
                      >
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator
                    v-if="index + 1 < urls.length"
                    class="hidden md:block"
                  />
                </template>
              </BreadcrumbList>
            </Breadcrumb>
          </ClientOnly>
        </div>
      </header>
      <div class="p-4 pt-0">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
  <StoreCreatorModal />
</template>

<script>
export default {
  name: "DashboardComponent",
  computed: {
    urls() {
      return this.$route.path.split("/").slice(1);
    },
  },
};
</script>
