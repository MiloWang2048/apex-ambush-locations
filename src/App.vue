<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from "./components/HelloWorld.vue";
import cloudbase from "@cloudbase/js-sdk";
import { provide } from "vue";
import { TCB_APP } from "./InjectKeys";

const {
  TCB_ENV_ID = import.meta.env.VITE_TCB_ENV_ID,
  TCB_REGION = import.meta.env.VITE_TCB_REGION,
} = window._tcbEnv || {};

if (!TCB_ENV_ID || !TCB_REGION) {
  throw new Error("TCB config not found.");
}

const tcb = cloudbase.init({
  env: TCB_ENV_ID,
  region: TCB_REGION,
});

provide(TCB_APP, tcb);
</script>

<template>
  <HelloWorld />
</template>

<style scoped></style>
