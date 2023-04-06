<script lang="ts" setup>
import { useCommonStore } from "../stores/common-store";
import { Close } from "@icon-park/vue-next";
import { useUserStore } from "../stores/user-store";
import { useLocationStore } from "../stores/location-store";
import { Maps } from "../libs/constants";
import { ApexMapName } from "../libs/types";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import type { Location } from "backend/dist/client/entities/location";

const commonStore = useCommonStore();
const userStore = useUserStore();
const locationStore = useLocationStore();

const router = useRouter();

async function handleLogout() {
  userStore.jwt = undefined;
  commonStore.showUserProfile = false;
}

onMounted(locationStore.fetchMyLocations);

async function goToLocation(location: Location) {
  await router.push(`/${location.map}/location/${location.id}`);
  commonStore.showUserProfile = false;
}
</script>

<template>
  <div
    v-if="commonStore.showUserProfile"
    class="fixed inset-0 z-10 m-auto h-[48rem] w-[54rem] rounded-xl border-2 border-neutral-400 bg-black bg-opacity-50 p-6 backdrop-blur-xl"
  >
    <h2 class="mb-4 text-3xl">
      {{ userStore.user?.email }}
    </h2>

    <button
      class="inline-block rounded-sm bg-neutral-500 px-2 hover:bg-apex-red"
      @click="handleLogout"
    >
      退出登录
    </button>

    <h3 class="my-4 text-2xl">我上传的点位</h3>
    <div class="grid grid-cols-2 gap-4">
      <div
        class="py-2 px-4 outline-1 outline-neutral-200 hover:outline"
        v-for="location in locationStore.myLocations"
        :key="location.id"
        @click="goToLocation(location)"
      >
        <p>
          <span class="text-lg font-bold">{{ location.name }}</span>
          <span class="ml-2 inline-block text-sm text-neutral-400"
            >[{{ location.x.toFixed(2) }}, {{ location.y.toFixed(2) }}]
            {{ Maps[location.map as ApexMapName]?.displayName }}</span
          >
        </p>
        <p class="text-right">
          <span
            class="inline-block max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-neutral-400"
            >{{ location.description }}</span
          >
        </p>
      </div>
    </div>

    <div
      class="absolute top-0 -right-10 flex h-8 w-8 flex-col justify-center rounded bg-black bg-opacity-50 backdrop-blur-md hover:bg-apex-red"
      @click="commonStore.showUserProfile = false"
    >
      <Close class="mx-1 block" size="24" fill="white" />
    </div>
  </div>
</template>
