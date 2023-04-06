<script setup lang="ts">
import { RouterView } from "vue-router";
import ApexPointer from "./components/ApexPointer.vue";
import Navigator from "./components/Navigator.vue";
import { useCommonStore } from "./stores/common-store";
import GlobalAlert from "./components/GlobalAlert.vue";
import LoginPanel from "./components/LoginPanel.vue";
import UserProfile from "./components/UserProfile.vue";
import ConfirmBox from "./components/ConfirmBox.vue";

const commonStore = useCommonStore();
</script>

<template>
  <div @mouseup.right="commonStore.draggingMap = false">
    <RouterView />
    <Navigator />
    <ApexPointer />
    <GlobalAlert />
    <LoginPanel />
    <UserProfile />
    <ConfirmBox />
  </div>
</template>

<style scoped></style>
