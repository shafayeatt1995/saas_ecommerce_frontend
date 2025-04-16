<template>
  <div>
    <h1>Home</h1>
    <Button @click="login">Login</Button>
  </div>
</template>

<script>
import eventBus from "@/lib/eventBus";

export default {
  name: "IndexPage",
  methods: {
    login() {
      console.log("ami anik");
      eventBus.emit("loginModal");
    },
  },
};
</script>
