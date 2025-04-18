<template>
  <div><slot /></div>
</template>
<script>
export default {
  name: "KeyTrigger",
  props: { eventKey: { type: String, default: "" } },
  mounted() {
    document.addEventListener("keydown", this.handleKeyPress);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  },
  methods: {
    handleKeyPress(event) {
      if (event.key === this.eventKey) {
        this.$emit("action");
      }
    },
  },
};
</script>
