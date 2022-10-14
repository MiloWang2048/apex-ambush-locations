<script lang="ts" setup>
const emit = defineEmits(["click"]);
interface Props {
  x: number;
  y: number;
  selected?: boolean;
  scale?: number;
}
withDefaults(defineProps<Props>(), {
  scale: 0.5,
});
</script>

<template>
  <svg :x="x - 68 * scale" :y="y - 68 * scale" @click="emit('click')">
    <image
      class="box"
      :class="{ selected }"
      :style="`transform: scale(${scale});`"
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
}
.box:hover,
.selected {
  clip-path: path("M68,-5 l73,73 l-73,73 l-73,-73 Z");
}
</style>
