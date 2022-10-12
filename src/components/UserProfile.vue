<script lang="ts" setup>
import { useCommonStore } from "../stores/CommonStore";
import { Close } from "@icon-park/vue-next";
import { inject } from "vue";
import { TCB_AUTH } from "../InjectKeys";
import { handleTcbError } from "../libs/utils";

const commonStore = useCommonStore();
const auth = inject(TCB_AUTH);

async function handleLogout() {
  try {
    await auth?.signOut();
    commonStore.user = undefined;
    commonStore.showUserProfile = false;
  } catch (error) {
    handleTcbError(commonStore, error);
  }
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
