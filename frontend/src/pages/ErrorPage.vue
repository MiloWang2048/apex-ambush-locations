<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <h1 class="mx-auto mt-80 text-center text-3xl">
    {{ route.query.msg ?? "404 Not Found" }}
  </h1>
</template>
