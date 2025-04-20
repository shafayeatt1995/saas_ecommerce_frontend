<template>
  <QuillEditor
    v-model:content="value"
    theme="snow"
    toolbar="full"
    contentType="html"
  />
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  name: "TextEditor",
  components: {
    QuillEditor,
  },
  computed: {
    value: {
      get() {
        return this.$attrs.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
};
</script>

<style>
.ql-image {
  display: none !important;
}
</style>
