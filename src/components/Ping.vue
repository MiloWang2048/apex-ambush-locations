<script lang="ts" setup>
const emit = defineEmits(["click"]);
const { x, y, selected } = defineProps<{
  x: number;
  y: number;
  selected?: boolean;
}>();
</script>

<template>
  <svg :x="x - 34" :y="y - 34" @click="emit('click')">
    <image
      class="box"
      :class="{ selected }"
      href="/ping.png"
      width="136"
      height="136"
    />
  </svg>
</template>

<style scoped>
.box {
  clip-path: path("M68,34 l34,34 l-34,34 l-34,-34 Z");
  transition: clip-path 0.2s;
  transform: scale(0.5);
}
.box:hover,
.selected {
  clip-path: path("M68,-5 l73,73 l-73,73 l-73,-73 Z");
}
</style>
