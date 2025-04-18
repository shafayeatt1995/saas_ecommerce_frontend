<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden lg:border border-gray-200 lg:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 hidden lg:block">
              <tr
                class="grid"
                style="grid-template-columns: var(--grid-template-columns)"
                :style="{ '--grid-template-columns': grid_template_columns }"
              >
                <template v-for="field in fields">
                  <th
                    v-if="!field.hide || false"
                    :key="field.key"
                    class="py-3.5 px-4 text-sm text-gray-500 uppercase text-left font-medium flex items-center"
                    :class="[
                      field.title_class,
                      field.sortable ? 'cursor-pointer' : '',
                    ]"
                    @click="checkSortable ? $emit('sorted', field) : null"
                  >
                    <slot :name="field.key + '-label'">
                      <img
                        v-if="field.title_image"
                        loading="lazy"
                        :src="field.title_image"
                        :alt="field.key"
                      />
                      <template v-else>
                        {{ field.hide_title ? "" : field.label }}
                      </template>
                      <i
                        v-if="checkSortable(field)"
                        class="fas fa-arrow-down-long ml-2"
                        :class="field.rotate_sort ? 'rotate-180' : ''"
                      />
                    </slot>
                  </th>
                </template>
              </tr>
            </thead>
            <tbody class="lg:bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, index) in items"
                :key="index"
                :class="[
                  bodyClicked ? 'cursor-pointer' : '',
                  hoverStripe ? 'hover:bg-gray-50' : '',
                  active === index ? 'bg-gray-100' : '',
                ]"
                class="flex flex-col lg:grid mb-8 lg:mb-0 divide-y lg:divide-y-0 divide-gray-200 border md:border-0 -mt-[1px] hover:bg-muted"
                style="grid-template-columns: var(--grid-template-columns)"
                :style="{ '--grid-template-columns': grid_template_columns }"
                @click="bodyClicked ? $emit('bodyClicked', index) : null"
              >
                <template v-for="field in fields">
                  <td
                    v-if="!field.hide || false"
                    :key="field.key"
                    class="px-4 py-4 text-sm font-medium flex items-center text-gray-700 overflow-hidden"
                    :class="[
                      data_index === index
                        ? slot_name.some((data) => data === field.key)
                          ? ''
                          : 'hidden lg:block'
                        : '',
                      field.class,
                    ]"
                    :style="{ '--col-span-mobile': field.col_span_mobile || 1 }"
                    @click.capture="activeDropdown = item?._id"
                  >
                    <div
                      v-if="skeleton"
                      class="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 animate-pulse sm:space-y-0 sm:flex-row"
                    >
                      <p class="w-full h-3 bg-gray-200 rounded-lg"></p>
                    </div>
                    <div
                      v-else
                      class="flex justify-between flex-1 items-center"
                    >
                      <div v-if="!field.hideSmLabel" class="lg:hidden">
                        {{ field.label }}
                      </div>
                      <slot
                        :name="field.key"
                        :item="item"
                        :index="index"
                        :value="item[field.key]"
                      >
                        {{ item[field.key] }}
                      </slot>
                    </div>
                  </td>
                </template>
                <slot name="information" :item="item" :index="index" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="rounded-lg overflow-hidden">
      <slot name="empty" />
    </div>
  </div>
</template>
<script>
export default {
  name: "TableResponsive",
  props: {
    fields: Array,
    items: {
      type: [Array, Number],
      default: () => [],
    },
    title: String,
    hoverStripe: Boolean,
    scrollable: Boolean,
    bodyClicked: Boolean,
    skeleton: Boolean,
    activeSort: String,
    active: { type: Number, default: null },
  },

  data() {
    return {
      data_index: "",
      slot_name: [],
      scrollLeft: 0,
      activeDropdown: "",
    };
  },

  computed: {
    grid_template_columns() {
      const filter = this.fields.filter((data) => !data.hide);
      return filter
        .map((field) => {
          let span;

          if (typeof field.span === "number") {
            span = field.span + "fr";
          } else if (typeof field.span === "string") {
            span = field.span;
          } else {
            span = "1fr";
          }
          return span;
        })
        .join(" ");
    },
    checkSortable() {
      return (field) => {
        return field.sortable && field.key == this.activeSort;
      };
    },
  },
};
</script>
