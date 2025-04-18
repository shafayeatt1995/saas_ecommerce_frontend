<template>
  <form
    v-if="edit"
    class="w-full flex items-center gap-1"
    @submit.prevent="saveEdit"
  >
    <Input v-model="val" class="w-full h-8 text-gray-800" ref="inp" />
    <Button type="submit" class="size-8"><CheckIcon /></Button>
    <Button
      type="button"
      @click.stop="cancelEdit"
      class="size-8"
      variant="destructiveOutline"
    >
      <XIcon />
    </Button>
  </form>
  <div class="flex gap-1 items-center" v-else>
    <component
      :is="tag"
      @click.stop="setEdit"
      class="w-full"
      :class="textClass"
      >{{ modelValue }}</component
    >
    <TooltipProvider v-if="showEdit">
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            type="button"
            class="size-8"
            @click="setEdit"
            variant="outline"
          >
            <FilePenLineIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script>
import { CheckIcon, FilePenLineIcon, XIcon } from "lucide-vue-next";

export default {
  components: { CheckIcon, XIcon, FilePenLineIcon },
  props: {
    tag: {
      type: String,
      default: "span",
    },
    textClass: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    showEdit: {
      type: Boolean,
      default: false,
    },
    editMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      edit: false,
      val: this.modelValue,
      reset: this.modelValue,
    };
  },
  watch: {
    modelValue(newVal) {
      this.val = newVal;
    },
    val(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
  methods: {
    setEdit() {
      try {
        if (this.editMode) {
          this.edit = true;
          this.reset = this.val;
          this.$nextTick(() => {
            this.$refs.inp.$el.focus();
          });
          this.$emit("edit", this.val);
        }
      } catch (error) {
        console.error(error);
      }
    },
    saveEdit() {
      this.edit = false;
      this.reset = this.val;
      this.$emit("save", this.val);
    },
    cancelEdit() {
      this.val = this.reset;
      this.edit = false;
      this.$emit("cancel", this.val);
    },
  },
};
</script>
