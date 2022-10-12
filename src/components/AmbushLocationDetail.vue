<script lang="ts" setup>
import { Maps } from "../libs/constants";
import { useCommonStore } from "../stores/CommonStore";
import { AmbushLocation } from "../types";
import { Close } from "@icon-park/vue-next";
import { useRoute, useRouter } from "vue-router";
import DOMPurify from "dompurify";
import { marked } from "marked";

const { locationId } = defineProps<{ locationId: string }>();
const location: AmbushLocation = {
  name: "测试点位",
  map: "kings_canyon",
  x: 400,
  y: 400,
  description: `
# 一级标题
## 二级标题
### 三级标题

段落段落段落段落段落段落段落

**加粗文本**

*斜体文本*

- 无序列表
- 无序列表
- 无序列表
- 无序列表

1. 有序列表
2. 有序列表
3. 有序列表
4. 有序列表

> 引用
>
> 引用

---

[链接](https://markdown.com.cn)

![这是图片](/Kings_Canyon_MU4.webp)
`,
};
const commonStore = useCommonStore();
const router = useRouter();
const route = useRoute();
</script>

<template>
  <div
    class="fixed right-4 bottom-4 top-14 z-[2] flex w-5/12"
    :class="{ 'pointer-events-none': commonStore.draggingMap }"
    @contextmenu.prevent
  >
    <div
      class="flex h-8 w-8 flex-col items-center justify-center rounded-l-md bg-zinc-600 bg-opacity-50 backdrop-blur-xl hover:bg-apex-red"
      @click="router.push(`/${route.params.map}`)"
    >
      <Close class="mx-1 block" size="24" fill="white" />
    </div>
    <div
      class="h-full flex-grow overflow-x-hidden overflow-y-scroll rounded-xl rounded-tl-none bg-zinc-600 bg-opacity-50 backdrop-blur-xl"
    >
      <div class="p-4 pr-0">
        <h2 class="text-4xl">{{ location.name }}</h2>
        <p class="my-2 text-gray-400">
          {{ Maps[location.map].displayName }}
          [ {{ location.x }}, {{ location.y }} ]
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
