<template>
  <Store>
    <template v-if="store">
      {{ store.name }}
    </template>
  </Store>
</template>

<script>
export default {
  name: "Products",
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
  },
};
</script>
