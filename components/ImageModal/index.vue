<template>
  <Dialog :open="modal">
    <DialogContent class="max-w-4xl p-2 md:p-6 rounded-xl" hideClose>
      <DialogHeader>
        <DialogTitle class="flex justify-between items-center">
          <p>Images</p>
          <Button
            variant="destructiveOutline"
            @click="$emit('close')"
            size="icon"
          >
            <XIcon />
          </Button>
        </DialogTitle>
        <DialogDescription>
          <div class="flex justify-between items-center mb-2">
            <div
              v-for="(tab, index) in tabs"
              :key="index"
              class="cursor-pointer border-b-2 flex-1"
              :class="{
                'font-bold': activeTab === tab,
                'border-black': activeTab === tab,
              }"
              @click="activeTab = tab"
            >
              <p class="text-black text-center py-2">{{ tab }}</p>
            </div>
          </div>
          <div>
            <ImageModalImage
              v-if="activeTab === 'Select images'"
              :multiSelect="multiSelect"
              v-model="selectImages"
            />
            <ImageModalUpload v-else-if="activeTab === 'Upload image'" />
            <ImageModalDelete v-else-if="activeTab === 'Delete image'" />
          </div>
        </DialogDescription>
      </DialogHeader>
      <KeyTrigger eventKey="Escape" @action="$emit('close')" />
    </DialogContent>
  </Dialog>
</template>

<script>
import { XIcon } from "lucide-vue-next";

export default {
  name: "ImageModal",
  components: { XIcon },
  props: {
    modal: Boolean,
    multiSelect: Boolean,
  },
  data() {
    return {
      tabs: ["Select images", "Upload image", "Delete image"],
      activeTab: "Select images",
    };
  },
  computed: {
    selectImages: {
      get() {
        return this.$attrs.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
  watch: {
    modal(val) {
      if (!val) {
        this.activeTab = "Select images";
      }
    },
  },
};
</script>
