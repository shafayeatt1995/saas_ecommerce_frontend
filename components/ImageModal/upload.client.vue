<template>
  <div class="max-h-[500px] overflow-y-auto">
    <p class="text-gray-700 mt-4 mb-2">
      You can upload max 50 images in a single batch
    </p>
    <vueDropzone
      id="myDropzone"
      ref="myDropzone"
      :options="dropzoneOptions"
      @vdropzone-queue-complete="onSuccess"
    >
      <template v-slot:dz-preview="previewArgs"> </template>
    </vueDropzone>
  </div>
</template>

<script>
import vueDropzone from "dropzone-vue3";

export default {
  name: "ImageModalUpload",
  components: {
    vueDropzone,
  },
  data() {
    return {
      dropzoneOptions: {
        url: `${useRuntimeConfig()?.public?.API2_URL}/user/image`,
        headers: {
          Authorization: `bearer ${
            useUtils()?.cookieParse()?.sessionToken || null
          }`,
        },
        paramName: "image",
        acceptedFiles: "image/*",
        maxFilesize: 10,
        maxFiles: 50,
        dictMaxFilesExceeded: "You can't upload more than 20 images at a time",
        dictDefaultMessage: `<div class="flex flex-col items-center" ><p class="text-8xl text-black"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" fill="currentColor"/></svg></p>
        <br /> Click or drop file here to upload. Max file size 10 MB</div>`,
      },
    };
  },
  methods: {
    onSuccess() {
      const { resetImages } = useImg();
      resetImages();
    },
  },
};
</script>
