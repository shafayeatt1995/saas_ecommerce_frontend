<template>
  <Head>
    <Title>{{ title }} - {{ appName }}</Title>
    <Meta name="description" :content="description" v-if="description" />
    <Meta property="og:title" :content="title" v-if="title" />
    <Meta property="og:description" :content="description" v-if="description" />
    <Meta name="twitter:title" :content="title" v-if="title" />
    <Meta
      name="twitter:description"
      :content="description"
      v-if="description"
    />
    <slot />
  </Head>
</template>

<script>
export default {
  name: "MetaHead",
  props: { title: String, description: String },
};
</script>
