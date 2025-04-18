<template>
  <div>
    <h1>Home</h1>
    <NuxtLink to="/dashboard">Dashboard</NuxtLink>
    <Button @click="login">Login</Button>
  </div>
</template>

<script>
import eventBus from "@/lib/eventBus";

export default {
  name: "IndexPage",
  methods: {
    login() {
      eventBus.emit("loginModal");
    },
  },
};
</script>
