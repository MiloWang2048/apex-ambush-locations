<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import * as math from "mathjs";
import { useRoute, useRouter } from "vue-router";
import { ApexMap } from "../libs/types";
import Ping from "./Ping.vue";
import { useCommonStore } from "../stores/common-store";
import type { Location } from "backend/dist/client/entities/location";
import { DefaultLocation } from "../libs/constants";

const { map, scaleSpeed } = defineProps<{
  locations: Location[];
  map: ApexMap;
  scaleSpeed: number;
}>();

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
  const initScale = map.height / canvas.value.clientHeight;
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
    (initScale * canvas.value.clientWidth - map.width) / -2,
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
  const initScale = map.height / canvas.value.clientHeight;
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
  const initScale = map.height / canvas.value.clientHeight;
  const initTopLeft = [
    (initScale * canvas.value.clientWidth - map.width) / -2,
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
}

function openLocationDetail(
  id: number,
  edit?: boolean,
  x?: number,
  y?: number
) {
  router.push({
    path: `/${commonStore.mapName}/location/${id}`,
    query: {
      edit: edit ? "true" : undefined,
      x,
      y,
    },
  });
}

const commonStore = useCommonStore();

function markNewLocation(e: MouseEvent) {
  if (!commonStore.pingNewLocation) return;
  const coordination = math
    .chain([e.clientX, e.clientY])
    .multiply(scale.value)
    .add(viewBox.value.offset)
    .done();
  commonStore.pingNewLocation = false;
  focus(coordination[0], coordination[1]);
  openLocationDetail(DefaultLocation.id, true, ...coordination);
}

const dragStart = ref<[number, number]>();
function startDrag(e: MouseEvent) {
  commonStore.draggingMap = true;
  dragStart.value = [e.x, e.y];
}

function endDrag(e: MouseEvent) {
  if (!dragStart.value) return;
  if (math.norm([e.x - dragStart.value[0], e.y - dragStart.value[1]]) < 5)
    commonStore.pingNewLocation = false;
  dragStart.value = undefined;
}

function handleClickLocation(location: Location) {
  if (location.id === DefaultLocation.id) return;
  focus(location.x, location.y);
  openLocationDetail(location.id);
}
</script>

<template>
  <svg
    class="h-screen w-screen"
    :viewBox="`${viewBox.offset[0]} ${viewBox.offset[1]} ${viewBox.rect[0]} ${viewBox.rect[1]}`"
    preserveAspectRatio="none"
    ref="canvas"
    @contextmenu.prevent
    @mousemove="handleDrag"
    @mousedown.right="startDrag"
    @mouseup.right="endDrag"
    @click.left="markNewLocation"
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
      @click="handleClickLocation(location)"
    />
  </svg>
  <RouterView />
</template>

<style scoped></style>
