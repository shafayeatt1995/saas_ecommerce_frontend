<template>
  <div class="container mx-auto">
    <div
      class="flex flex-col-reverse lg:flex-row justify-center items-center min-h-screen p-2"
    >
      <div class="flex-1">
        <div>
          <p class="text-9xl font-black text-center">{{ error.statusCode }}</p>
          <h1
            class="my-2 text-gray-800 font-bold text-2xl text-center lg:text-left"
          >
            {{
              error.statusCode == 500 ? "Internal server error" : error.message
            }}
          </h1>
          <p class="my-2 text-gray-800 text-center lg:text-left">
            The page you are looking for might temporary unavailable.
          </p>
        </div>
      </div>
      <div class="flex-1 flex justify-end">
        <NuxtImg src="/404.svg" class="w-full" alt="404" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
  computed: {
    error() {
      return this.$attrs.error;
    },
  },
};
</script>
