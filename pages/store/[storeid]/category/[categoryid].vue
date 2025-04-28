<template>
  <Store>{{ store.name }} {{ store.logo }}</Store>
</template>

<script>
export default {
  name: "Category",
  computed: {
    store() {
      const { store } = useFrontend();
      return store.value;
    },
  },
};
</script>
