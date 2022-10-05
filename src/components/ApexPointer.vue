<template>
  <div class="cursor horizontal" :style="`left: ${mouse.left}px;`"></div>
  <div class="cursor vertical" :style="`top: ${mouse.top}px;`"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const mouse = ref({ left: -10, top: -10 });
document.addEventListener("mousemove", (e: MouseEvent) => {
  mouse.value.left = e.clientX;
  mouse.value.top = e.clientY;
});
</script>

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
