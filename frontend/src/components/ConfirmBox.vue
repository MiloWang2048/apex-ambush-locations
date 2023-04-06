<script setup lang="ts">
import { useConfirmStore } from "../stores/confirm-store";
import { Close } from "@icon-park/vue-next";

const confirmStore = useConfirmStore();
</script>
<template>
  <div
    v-if="confirmStore.confirmData"
    class="fixed inset-0 z-10 m-auto h-[18rem] w-[24rem] rounded-xl border-2 border-neutral-400 bg-black bg-opacity-50 p-6 backdrop-blur-xl"
  >
    <div class="flex h-full flex-col">
      <h2 class="mb-4 text-center text-xl">
        {{ confirmStore.confirmData?.title }}
      </h2>
      <div class="grow">{{ confirmStore.confirmData?.text }}</div>
      <div class="text-center">
        <button
          class="mx-auto mt-4 mr-4 inline-block w-32 bg-neutral-600 py-1 text-lg font-bold hover:bg-apex-red"
          @click="confirmStore.resolveConfirmationResult?.(true)"
        >
          确认
        </button>
        <button
          class="mx-auto mt-4 inline-block w-32 bg-neutral-600 py-1 text-lg font-bold hover:bg-apex-red"
          @click="confirmStore.resolveConfirmationResult?.(false)"
        >
          取消
        </button>
      </div>
    </div>
    <div
      class="absolute top-0 -right-10 flex h-8 w-8 flex-col justify-center rounded bg-black bg-opacity-50 backdrop-blur-md hover:bg-apex-red"
      @click="confirmStore.resolveConfirmationResult?.(false)"
    >
      <Close class="mx-1 block" size="24" fill="white" />
    </div>
  </div>
</template>
<style scoped></style>
