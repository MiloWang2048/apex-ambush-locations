<script lang="ts" setup>
import { useCommonStore } from "../stores/common-store";
import { Close } from "@icon-park/vue-next";

const commonStore = useCommonStore();

async function handleLogout() {
  commonStore.jwt = undefined;
  commonStore.showUserProfile = false;
}
</script>

<template>
  <div
    v-if="commonStore.showUserProfile"
    class="fixed inset-0 z-10 m-auto h-[48rem] w-[54rem] rounded-xl border-2 border-neutral-400 bg-black bg-opacity-50 p-6 backdrop-blur-xl"
  >
    <div class="mb-4 text-3xl">
      {{ commonStore.user?.email }}
    </div>

    <button
      class="inline-block rounded-sm bg-neutral-500 px-2 hover:bg-apex-red"
      @click="handleLogout"
    >
      退出登录
    </button>

    <div
      class="absolute top-0 -right-10 flex h-8 w-8 flex-col justify-center rounded bg-black bg-opacity-50 backdrop-blur-md hover:bg-apex-red"
      @click="commonStore.showUserProfile = false"
    >
      <Close class="mx-1 block" size="24" fill="white" />
    </div>
  </div>
</template>
