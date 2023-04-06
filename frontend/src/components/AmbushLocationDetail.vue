<script lang="ts" setup>
import { throttle } from "../libs/utils";
import { Maps } from "../libs/constants";
import { useCommonStore } from "../stores/common-store";
import { Close, Save, CloseOne, Editor, Delete } from "@icon-park/vue-next";
import { useRoute, useRouter } from "vue-router";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { DefaultLocation } from "../libs/constants";
import { ApexMapName } from "../libs/types";
import { computed } from "vue";
import { useConfirmStore } from "../stores/confirm-store";
import { useLocationStore } from "../stores/location-store";
import { useUserStore } from "../stores/user-store";

const router = useRouter();
const route = useRoute();

const locationId = computed(() => +route.params["locationId"]);

const commonStore = useCommonStore();
const locationStore = useLocationStore();
const userStore = useUserStore();

const location = computed(() =>
  locationStore.locations.find((location) => location.id === locationId.value)
);

const changeDescriptionThrottled = throttle((e) => {
  if (!location.value) return;
  location.value.description = (e.target as any)?.value;
}, 300);

async function save() {
  if (!location.value) return;
  if (locationId.value === DefaultLocation.id) {
    await locationStore.addLocation(location.value);
  } else {
    await locationStore.updateLocation(location.value);
  }
  router.push({ query: {} });
  commonStore.alert("点位已上传");
}
const confirmStore = useConfirmStore();
async function onDelete() {
  if (!location.value) return;
  const confirmed = await confirmStore.getUserConfirmation({
    title: "确认要删除点位吗？",
    text: "此操作不可恢复！",
  });
  if (!confirmed) return;
  await locationStore.removeLocation(location.value.id);
  if (confirmed) router.push(`/${commonStore.mapName}`);
}
</script>

<template>
  <div
    class="fixed right-4 bottom-4 top-14 z-[2] flex min-w-fit"
    :class="{ 'pointer-events-none': commonStore.draggingMap }"
    v-if="location"
    @contextmenu.prevent
  >
    <!-- close button -->
    <div>
      <div
        class="flex h-8 w-8 flex-col items-center justify-center rounded-l-md bg-zinc-600 bg-opacity-50 backdrop-blur-xl hover:bg-apex-red"
        @click="router.push(`/${commonStore.mapName}`)"
      >
        <Close class="mx-1 block" size="24" fill="white" />
      </div>
      <div
        v-if="route.query.edit"
        class="mt-2 w-8 rounded-l-md bg-green-500 py-2 text-center hover:bg-green-400"
        @click="save"
      >
        <Save class="mx-1 block" size="24" fill="white" />
        保 存
      </div>
      <div
        v-if="route.query.edit"
        class="mt-2 w-8 rounded-l-md bg-neutral-500 py-2 text-center hover:bg-neutral-400"
        @click="router.back()"
      >
        <CloseOne class="mx-1 block" size="24" fill="white" />
        取 消
      </div>
      <div
        v-if="!route.query.edit && userStore.user?.id === location.userId"
        class="mt-2 w-8 rounded-l-md bg-blue-500 py-2 text-center hover:bg-blue-400"
        @click="router.push({ path: '', query: { edit: 'true' } })"
      >
        <Editor class="mx-1 block" size="24" fill="white" />
        编 辑
      </div>
      <div
        v-if="route.query.edit && location.id !== DefaultLocation.id"
        class="mt-2 w-8 rounded-l-md bg-apex-red py-2 text-center hover:bg-apex-red-light"
        @click="onDelete"
      >
        <Delete class="mx-1 block" size="24" fill="white" />
        删 除
      </div>
    </div>

    <!-- editor -->
    <div
      v-if="route.query.edit"
      class="h-full w-[36rem] overflow-hidden rounded-xl rounded-t-none bg-zinc-600 bg-opacity-50 backdrop-blur-xl"
    >
      <div class="flex h-full flex-col p-4">
        <div class="flex items-baseline">
          <div class="mr-2">点位名称</div>
          <input
            type="text"
            id="title"
            class="block h-8 grow rounded-sm bg-neutral-800 px-2 leading-8 focus:outline-none"
            v-model="location.name"
          />
        </div>
        <div class="mt-4 flex grow items-stretch">
          <div class="mr-2">描述文本</div>
          <textarea
            type="text"
            id="title"
            class="grow resize-none rounded-sm bg-neutral-800 px-2 focus:outline-none"
            :value="location.description"
            @input="changeDescriptionThrottled"
          />
        </div>
      </div>
    </div>

    <!-- location detail -->
    <div
      class="h-full w-[36rem] overflow-x-hidden overflow-y-scroll rounded-xl rounded-tl-none bg-zinc-600 bg-opacity-50 backdrop-blur-xl"
    >
      <div class="p-4 pr-0">
        <h2 class="text-4xl">{{ location.name }}</h2>
        <p class="my-2 text-gray-400">
          {{ Maps[location.map as ApexMapName].displayName }}
          [ {{ location.x.toFixed(2) }}, {{ location.y.toFixed(2) }} ]
        </p>
        <div
          class="markdown"
          v-html="DOMPurify.sanitize(marked.parse(location.description))"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.markdown {
  h1 {
    @apply text-2xl leading-10;
  }
  h2 {
    @apply text-xl leading-8;
  }
  h3 {
    @apply text-lg leading-6;
  }
  p {
    @apply leading-8;
  }
  strong {
    @apply font-bold;
  }
  em {
    @apply italic;
  }
  ul {
    @apply relative left-5 list-disc;
  }
  ol {
    @apply relative left-4 list-decimal;
  }
  a {
    @apply rounded p-1 text-sky-300 hover:bg-slate-500;
  }
  hr {
    @apply py-1;
  }
  blockquote {
    @apply my-2 ml-2 border-l-2 border-gray-300 pl-2 backdrop-brightness-125;
  }
}
</style>
