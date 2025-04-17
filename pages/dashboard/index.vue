<template>
  <Dashboard>
    Ami anik
    {{ stores }}
    <br />
    <br />
    {{ selectStore }}
  </Dashboard>
</template>

<script>
export default {
  name: "DashboardPage",
  computed: {
    stores() {
      return useStore().stores.value;
    },
    selectStore() {
      return useStore().selectStore;
    },
  },
};
</script>
