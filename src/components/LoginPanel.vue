<script lang="ts" setup>
import { inject, ref } from "vue";
import { useCommonStore } from "../stores/CommonStore";
import { Close } from "@icon-park/vue-next";
import { TCB_APP, TCB_AUTH } from "../InjectKeys";
import {
  extractTcbErrorMessage,
  handleTcbError,
  KnownTcbErrors,
} from "../libs/utils";
import { e } from "mathjs";

const commonStore = useCommonStore();
const mode = ref<"SIGN_IN" | "SIGN_UP">("SIGN_IN");

const email = ref("");
const password = ref("");
const passwordRepeat = ref("");

const auth = inject(TCB_AUTH);

function checkForm(isSignUp = false): boolean {
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email.value)) {
    commonStore.alert("邮箱格式不正确，请检查");
    return false;
  }
  if (isSignUp && password.value !== passwordRepeat.value) {
    commonStore.alert("密码不一致，请检查");
    return false;
  }
  if (!/^[0-9a-zA-Z~!@#$%^&*_+-/]{8,32}$/.test(password.value)) {
    commonStore.alert(
      "密码长度必须在8-32位之间，只能包含数字、英文字母和这些特殊符号：~!@#$%^&*_+-/",
      5000
    );
    return false;
  }
  if (!/[0-9]+/.test(password.value) || !/[a-zA-Z]+/.test(password.value)) {
    commonStore.alert("密码至少需要包含英文字母和数字");
    return false;
  }
  return true;
}

async function submit() {
  if (!auth) return;
  if (mode.value === "SIGN_IN") {
    if (!checkForm()) return;
    try {
      const { user } = await auth.signInWithEmailAndPassword(
        email.value,
        password.value
      );
    } catch (error: any) {
      handleTcbError(commonStore, error);
    }
  } else {
    if (!checkForm(true)) return;
    try {
      await auth.signUpWithEmailAndPassword(email.value, password.value);
      commonStore.alert("已发送验证邮件，请检查邮箱");
      mode.value = "SIGN_IN";
    } catch (error: any) {
      handleTcbError(commonStore, error);
    }
  }
}
commonStore.showLoginPanel = false;
</script>

<template>
  <div
    v-if="commonStore.showLoginPanel"
    class="fixed inset-0 z-10 m-auto h-[20rem] w-[24rem] rounded-xl border-2 border-neutral-400 bg-black bg-opacity-50 backdrop-blur-xl"
  >
    <div class="my-6 mx-8 flex text-center text-2xl font-bold">
      <div
        class="grow py-1"
        :class="{
          'bg-neutral-500': mode === 'SIGN_IN',
          'hover:bg-neutral-700': mode !== 'SIGN_IN',
        }"
        @click="mode = 'SIGN_IN'"
      >
        登录
      </div>
      <div
        class="grow py-1"
        :class="{
          'bg-neutral-500': mode === 'SIGN_UP',
          'hover:bg-neutral-700': mode !== 'SIGN_UP',
        }"
        @click="mode = 'SIGN_UP'"
      >
        注册
      </div>
    </div>

    <div class="flex h-40 flex-col justify-center">
      <div class="my-2">
        <label for="email" class="inline-block w-24 text-center">邮箱</label>
        <input
          id="email"
          type="email"
          v-model="email"
          class="h-8 w-60 rounded-sm bg-neutral-600 px-2 leading-8 focus:outline-none"
        />
      </div>
      <div class="my-2">
        <label for="password" class="inline-block w-24 text-center">密码</label>
        <input
          id="password"
          type="password"
          v-model="password"
          class="h-8 w-60 rounded-sm bg-neutral-600 px-2 leading-8 focus:outline-none"
        />
      </div>
      <div class="my-2" v-if="mode === 'SIGN_UP'">
        <label for="password-repeat" class="inline-block w-24 text-center"
          >确认密码</label
        >
        <input
          id="password-repeat"
          type="password"
          v-model="passwordRepeat"
          class="h-8 w-60 rounded-sm bg-neutral-600 px-2 leading-8 focus:outline-none"
        />
      </div>
    </div>

    <button
      class="mx-auto mt-2 block w-32 bg-neutral-600 py-1 text-lg font-bold hover:bg-apex-red"
      @click="submit"
    >
      提交
    </button>

    <div
      class="absolute top-0 -right-10 flex h-8 w-8 flex-col justify-center rounded bg-black bg-opacity-50 backdrop-blur-md hover:bg-apex-red"
      @click="commonStore.showLoginPanel = false"
    >
      <Close class="mx-1 block" size="24" fill="white" />
    </div>
  </div>
</template>

<style scoped></style>
