<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { OffScreenOne } from "@icon-park/vue-next";
import { useCommonStore } from "../stores/common-store";

const mouse = ref({ left: -10, top: -10 });

function update(e: MouseEvent) {
  mouse.value.left = e.clientX;
  mouse.value.top = e.clientY;
}

onMounted(() => document.addEventListener("mousemove", update));
onUnmounted(() => document.removeEventListener("mousemove", update));

const commonStore = useCommonStore();
</script>

<template>
  <div class="cursor horizontal" :style="`left: ${mouse.left - 1.5}px;`"></div>
  <div class="cursor vertical" :style="`top: ${mouse.top - 1.5}px;`"></div>
  <OffScreenOne
    v-if="commonStore.pingNewLocation"
    class="pointer-events-none fixed z-50"
    theme="outline"
    size="24"
    :style="`left: ${mouse.left - 12}px; top: ${mouse.top - 12}px;`"
  />
</template>

<style>
* {
  cursor: none !important;
}

.cursor {
  position: fixed;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 9999;
  top: 0;
  pointer-events: none;
}

.vertical {
  width: 100vw;
  height: 3px;
}

.horizontal {
  width: 3px;
  height: 100vh;
}
</style>
