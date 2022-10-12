<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import * as math from "mathjs";
import { useRoute, useRouter } from "vue-router";
import { DefaultMap, Maps } from "../libs/constants";
import { AmbushLocation, ApexMap, ApexMapName } from "../types";
import Ping from "../components/Ping.vue";
import { re } from "mathjs";
import { useCommonStore } from "../stores/CommonStore";

const map = ref<ApexMap>(Maps.kings_canyon);
const route = useRoute();

watchEffect(() => {
  map.value = Maps[route.params.map as ApexMapName] || DefaultMap;
});

const scaleSpeed = 0.0015;

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
  const initScale = map.value.height / canvas.value.clientHeight;
  viewBox.value.rect = math.multiply(
    [canvas.value.clientWidth, canvas.value.clientHeight],
    initScale
  ) as [number, number];
  // if you directly assign value to viewBox.value.offset[0] like:
  // viewBox.value.offset[0] =
  //   (initScale * canvas.value.clientWidth - mapWidth) / -2;
  // the zoom function won't work.
  // this is fucking crazy.
  // TODO: figure out why.
  viewBox.value.offset = [
    (initScale * canvas.value.clientWidth - map.value.width) / -2,
    0,
  ];
  canvasWidth.value = canvas.value.clientWidth;
}
watchEffect(initViewBox);

const scale = computed(() => viewBox.value.rect[0] / canvasWidth.value);

function handleDrag(e: MouseEvent) {
  if (e.buttons !== 2) return;
  viewBox.value.offset[0] -= e.movementX * scale.value;
  viewBox.value.offset[1] -= e.movementY * scale.value;
  limitViewBoxOffset();
}

function handleZoom(e: WheelEvent) {
  if (!canvas.value) return;
  const initScale = map.value.height / canvas.value.clientHeight;
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
  const initScale = map.value.height / canvas.value.clientHeight;
  const initTopLeft = [
    (initScale * canvas.value.clientWidth - map.value.width) / -2,
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

const locations: AmbushLocation[] = [
  {
    name: "name",
    map: "kings_canyon",
    x: 400,
    y: 400,
    description: "",
    comments: [],
  },
  {
    name: "name",
    map: "kings_canyon",
    x: 400,
    y: 600,
    description: "",
    comments: [],
  },
  {
    name: "name",
    map: "kings_canyon",
    x: 600,
    y: 400,
    description: "",
    comments: [],
  },
  {
    name: "name",
    map: "kings_canyon",
    x: 600,
    y: 600,
    description: "",
    comments: [],
  },
];
const router = useRouter();
const baseViewBoxWidth = 600;
function focus(x: number, y: number) {
  if (!canvas.value) return;
  const aspectRatio = canvas.value?.clientHeight / canvas.value?.clientWidth;
  const rect: [number, number] = [
    baseViewBoxWidth,
    aspectRatio * baseViewBoxWidth,
  ];
  const offset: [number, number] = [x - baseViewBoxWidth / 4, y - rect[1] / 2];
  viewBox.value.offset = offset;
  viewBox.value.rect = rect;
  router.push(`/${route.params.map || DefaultMap.name}/location/123`);
}

const commonStore = useCommonStore();
</script>

<template>
  <svg
    class="h-screen w-screen"
    :viewBox="`${viewBox.offset[0]} ${viewBox.offset[1]} ${viewBox.rect[0]} ${viewBox.rect[1]}`"
    preserveAspectRatio="none"
    ref="canvas"
    @contextmenu.prevent
    @mousemove="handleDrag"
    @mousedown.right="commonStore.setDraggingMap(true)"
    @wheel="handleZoom"
  >
    <rect
      fill="black"
      x="-1000000"
      y="-1000000"
      width="2000000"
      height="2000000"
    />
    <image
      :href="map.imgUrl"
      x="0"
      y="0"
      :width="map.width"
      :height="map.height"
    />
    <Ping
      v-for="location of locations"
      :x="location.x"
      :y="location.y"
      @click="focus(location.x, location.y)"
    />
  </svg>
  <RouterView />
</template>

<style scoped></style>
