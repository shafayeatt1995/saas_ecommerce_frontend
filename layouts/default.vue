<template>
  <div>
    <slot />
  </div>
  <SocialLogin />
  <Toaster position="bottom-center" :expand="false" closeButton richColors />
  <ImagePreview />
</template>
<script>
export default {
  name: "DefaultLayout",
  watch: {
    $route() {
      const { cart } = useCart();
      cart.value.showCart = false;
    },
  },
  mounted() {
    const { value } = useData();
    value.isTablet = window.innerWidth < 1024;
    value.isMobile = window.innerWidth < 768;
    window.addEventListener("resize", (data) => {
      value.isTablet = data.target.innerWidth < 1024;
      value.isMobile = data.target.innerWidth < 768;
    });
  },
  unmounted() {
    window.removeEventListener("resize", () => {});
  },
};
</script>
