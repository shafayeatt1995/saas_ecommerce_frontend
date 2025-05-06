<template>
  <viewer
    ref="viewer"
    :images="images"
    class="viewer hidden"
    @inited="inited"
    @hide="images = []"
  >
    <template #default="scope">
      <img v-for="src in scope.images" :key="src" :src="src" />
      {{ scope.options }}
    </template>
  </viewer>
</template>

<script>
import eventBus from "@/lib/eventBus";
import { component as Viewer } from "v-viewer";
import "viewerjs/dist/viewer.css";

export default {
  name: "ImagePreview",
  components: {
    Viewer,
  },
  data() {
    return {
      images: [],
    };
  },
  mounted() {
    eventBus.on("previewImage", (url) => {
      this.previewImage(url);
    });
  },
  beforeUnmount() {
    eventBus.off("previewImage");
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    previewImage(urls) {
      this.images = [...new Set(urls)];
      this.$viewer.show();
    },
  },
};
</script>

<style scoped>
.image-preview-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}
</style>
