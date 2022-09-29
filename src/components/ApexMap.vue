<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import * as math from "mathjs";

const { mapImageUri, mapWidth, mapHeight, scaleSpeed } = defineProps({
  mapImageUri: { type: String, required: true },
  mapWidth: { type: Number, required: true },
  mapHeight: { type: Number, required: true },
  scaleSpeed: { type: Number, default: 0.0015 },
});

type ViewBox = {
  /**
   * startX, startY
   */
  offset: [number, number];
  /**
   * width, height
   */
  rect: [number, number];
};
const viewBox = ref<ViewBox>({
  offset: [0, 0],
  rect: [0, 0],
});

const canvas = ref<SVGSVGElement>();
const canvasWidth = ref(1);
function initViewBox() {
  if (!canvas.value) return;
  const initScale = mapHeight / canvas.value.clientHeight;
  viewBox.value.rect = math.multiply(
    [canvas.value.clientWidth, canvas.value.clientHeight],
    initScale
  ) as [number, number];
  // if you directly assign value to viewBox.value.offset[0],
  // the zoom function won't work.
  // this is fucking crazy.
  // TODO: figure out why.
  viewBox.value.offset = [
    (initScale * canvas.value.clientWidth - mapWidth) / -2,
    0,
  ];
  canvasWidth.value = canvas.value.clientWidth;
}
watchEffect(initViewBox);

const scale = computed(() => viewBox.value.rect[0] / canvasWidth.value);

const mouse = ref({ left: 0, top: 0 });

function handleDrag(e: MouseEvent) {
  mouse.value.left = e.clientX;
  mouse.value.top = e.clientY;
  if (e.buttons !== 2) return;
  viewBox.value.offset[0] -= e.movementX * scale.value;
  viewBox.value.offset[1] -= e.movementY * scale.value;
  limitViewBoxOffset();
}

function handleZoom(e: WheelEvent) {
  if (!canvas.value) return;
  const initScale = mapHeight / canvas.value.clientHeight;
  const scaleCenter = math
    .chain([e.clientX, e.clientY])
    .multiply(scale.value)
    .add(viewBox.value.offset)
    .done();
  const scaleCenterToTopLeftVector = math.subtract(
    viewBox.value.offset,
    scaleCenter
  );
  const scaleCenterToBottomRightVector = math.subtract(
    math.add(viewBox.value.offset, viewBox.value.rect),
    scaleCenter
  );
  const scaleRate = e.deltaY * scaleSpeed + 1;
  const newOffset = math
    .chain(scaleCenterToTopLeftVector)
    .multiply(scaleRate)
    .add(scaleCenter)
    .done() as [number, number];
  const newRect = math
    .chain(scaleCenterToBottomRightVector)
    .multiply(e.deltaY * scaleSpeed + 1)
    .add(scaleCenter)
    .subtract(newOffset)
    .done() as [number, number];
  if (newRect[0] / canvasWidth.value > initScale) {
    initViewBox();
    return;
  }
  viewBox.value.offset = newOffset;
  viewBox.value.rect = newRect;
  limitViewBoxOffset();
}

function limitViewBoxOffset() {
  if (!canvas.value) return;
  const initScale = mapHeight / canvas.value.clientHeight;
  const initTopLeft = [
    (initScale * canvas.value.clientWidth - mapWidth) / -2,
    0,
  ];
  const initBottomRight = math
    .chain([canvas.value.clientWidth, canvas.value.clientHeight])
    .multiply(initScale)
    .add(initTopLeft)
    .done() as [number, number];
  const topLeft = viewBox.value.offset;
  const bottomRight = math.add(topLeft, viewBox.value.rect);
  const offsetDelta = [0, 0];
  offsetDelta[0] += math.max(initTopLeft[0] - topLeft[0], 0);
  offsetDelta[1] += math.max(initTopLeft[1] - topLeft[1], 0);
  offsetDelta[0] -= math.max(bottomRight[0] - initBottomRight[0], 0);
  offsetDelta[1] -= math.max(bottomRight[1] - initBottomRight[1], 0);
  viewBox.value.offset = math.add(viewBox.value.offset, offsetDelta) as [
    number,
    number
  ];
}
</script>

<template>
  <div
    @contextmenu.prevent
    @mousemove="handleDrag"
    @wheel="handleZoom"
    class="cursor-none"
  >
    <div class="cursor horizontal" :style="`left: ${mouse.left}px;`"></div>
    <div class="cursor vertical" :style="`top: ${mouse.top}px;`"></div>
    <svg
      class="w-screen h-screen z-[-1] relative"
      :viewBox="`${viewBox.offset[0]} ${viewBox.offset[1]} ${viewBox.rect[0]} ${viewBox.rect[1]}`"
      preserveAspectRatio="none"
      ref="canvas"
    >
      <rect
        fill="black"
        x="-1000000"
        y="-1000000"
        width="2000000"
        height="2000000"
      />
      <image
        :href="mapImageUri"
        x="0"
        y="0"
        :width="mapWidth"
        :height="mapHeight"
      />
    </svg>
  </div>
</template>

<style scoped>
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
