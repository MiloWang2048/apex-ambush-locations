<script lang="ts" setup>
import { useCommonStore } from "../stores/CommonStore";

const commonStore = useCommonStore();
</script>

<template>
  <div
    v-if="commonStore.globalMessage"
    class="fixed top-16 left-1/3 right-1/3 z-10 rounded-lg bg-black bg-opacity-70 py-2 px-4 backdrop-blur"
  >
    {{ commonStore.globalMessage }}
  </div>
</template>

<style scoped></style>
