<script lang="ts" setup>
import { Maps } from "../libs/constants";
import { useCommonStore } from "../stores/CommonStore";
import { AmbushLocation } from "../types";
import { Close } from "@icon-park/vue-next";
import { useRoute, useRouter } from "vue-router";

const { locationId } = defineProps<{ locationId: string }>();
const location: AmbushLocation = {
  name: "测试点位",
  map: "kings_canyon",
  x: 400,
  y: 400,
  description: `Lorem ipsum dolor sit amet. Ex similique cupiditate id iste assumenda qui dolores optio cum odit veniam a quia sint et maxime voluptas. Est earum velit qui magni eveniet sed voluptas officia. 33 ullam voluptate in ipsum voluptates sit tenetur eius non rerum officiis est quas iure in quasi molestiae.

Ut porro architecto ex dolorem iusto ut quia animi. Ut quia iure et ipsa corporis et fuga ipsum a ipsam quos qui odio recusandae. Ea incidunt ratione est reiciendis fuga sit voluptatem excepturi aut autem autem At reiciendis harum ex neque maiores ut architecto velit?

Aut sint Quis non unde voluptatem est quas alias. Eos dolores rerum in aspernatur quia sit quam dolorem ut soluta galisum! Et sunt delectus sed autem totam in consequuntur nostrum aut aliquam minima id facere neque 33 laborum saepe! Est commodi asperiores id consequatur quis et consequatur pariatur sed eligendi voluptas 33 magnam aliquam ad nihil explicabo.`,
  comments: [
    {
      authorId: "1",
      authorName: "voluptatem",
      likes: ["1", "2"],
      content:
        "Ut quia iure et ipsa corporis et fuga ipsum a ipsam quos qui odio recusandae.\nEos dolores rerum in aspernatur quia sit quam dolorem ut soluta galisum!",
      time: "2022/10/8 00:35:43",
    },
    {
      authorId: "2",
      authorName: "voluptatem",
      likes: ["1", "2"],
      content:
        "Ut quia iure et ipsa corporis et fuga ipsum a ipsam quos qui odio recusandae.\nEos dolores rerum in aspernatur quia sit quam dolorem ut soluta galisum!",
      time: "2022/10/8 00:35:43",
    },
    {
      authorId: "3",
      authorName: "voluptatem",
      likes: ["1", "2"],
      content:
        "Ut quia iure et ipsa corporis et fuga ipsum a ipsam quos qui odio recusandae.\nEos dolores rerum in aspernatur quia sit quam dolorem ut soluta galisum!",
      time: "2022/10/8 00:35:43",
    },
    {
      authorId: "4",
      authorName: "voluptatem",
      likes: ["1", "2"],
      content:
        "Ut quia iure et ipsa corporis et fuga ipsum a ipsam quos qui odio recusandae.\nEos dolores rerum in aspernatur quia sit quam dolorem ut soluta galisum!",
      time: "2022/10/8 00:35:43",
    },
    {
      authorId: "5",
      authorName: "voluptatem",
      likes: ["1", "2"],
      content:
        "Ut quia iure et ipsa corporis et fuga ipsum a ipsam quos qui odio recusandae.\nEos dolores rerum in aspernatur quia sit quam dolorem ut soluta galisum!",
      time: "2022/10/8 00:35:43",
    },
  ],
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
      class="h-full overflow-y-scroll rounded-xl rounded-tl-none bg-zinc-600 bg-opacity-50 backdrop-blur-xl"
    >
      <div class="p-4">
        <h2 class="text-4xl">{{ location.name }}</h2>
        <p class="my-2 text-gray-400">
          {{ Maps[location.map].displayName }}
          [ {{ location.x }}, {{ location.y }} ]
        </p>
        <p>{{ location.description }}</p>
      </div>
      <div class="h-px bg-white bg-opacity-30"></div>
      <div class="m-4">
        <h2 class="mb-2 text-3xl">评论</h2>
        <template v-for="(comment, index) of location.comments">
          <div>
            <h3 class="mb-1 text-2xl">
              {{ comment.authorName }}
              <span class="ml-4 inline-block text-sm text-gray-400">{{
                comment.time
              }}</span>
            </h3>
            <p>{{ comment.content }}</p>
          </div>
          <div
            v-if="index !== location.comments.length - 1"
            class="my-2 h-px bg-white bg-opacity-30"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
