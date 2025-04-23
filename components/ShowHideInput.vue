<template>
  <div class="relative">
    <Input
      id="name"
      :type="show ? type : 'password'"
      v-model="value"
      class="pr-9"
    />
    <button
      class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      @click="show = !show"
    >
      <EyeIcon v-if="show" :size="16" />
      <EyeOffIcon v-else :size="16" />
    </button>
  </div>
</template>

<script>
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";

export default {
  name: "ShowHideInput",
  components: {
    EyeIcon,
    EyeOffIcon,
  },
  props: {
    type: {
      type: String,
      default: "text",
    },
  },
  data() {
    return {
      show: false,
    };
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
