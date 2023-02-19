<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useCommonStore } from "../stores/common-store";
import { Close } from "@icon-park/vue-next";
import backend from "backend";
import type { Captcha } from "backend/dist/client/functions/auth/getCaptchaToken";

const commonStore = useCommonStore();

const email = ref("");
const userCaptchaAnswer = ref("");
const emailVerificationUserAnswer = ref("");

const captcha = ref<Captcha>();
async function fetchCaptcha() {
  captcha.value = await backend.auth.getCaptchaToken();
}
onMounted(fetchCaptcha);

const emailVerifyToken = ref<string>();
const emailVerificationCountdown = ref(0);

async function sendEmailVerification() {
  if (emailVerificationCountdown.value > 0) {
    return;
  }
  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email.value)) {
    commonStore.alert("邮箱格式不正确，请检查");
    return;
  }
  if (!/^[\d\w]{4}$/.test(userCaptchaAnswer.value)) {
    commonStore.alert("图形验证码格式不正确，请检查");
    return;
  }
  if (!captcha.value || Date.now() > captcha.value.expires) {
    commonStore.alert("图形验证码过期，请重新输入");
    await fetchCaptcha();
    return;
  }
  try {
    emailVerifyToken.value = await backend.auth.getEmailVerifyToken(
      captcha.value.captchaToken,
      userCaptchaAnswer.value,
      email.value
    );
  } catch (err) {
    commonStore.alert(String(err));
  }
  emailVerificationCountdown.value = 60;
}

let intervalId: number;
onMounted(() => {
  intervalId = setInterval(() => {
    if (emailVerificationCountdown.value > 0) {
      emailVerificationCountdown.value -= 1;
    }
    if (captcha.value && Date.now() > captcha.value.expires) {
      fetchCaptcha();
    }
  }, 1000);
});

onUnmounted(() => clearInterval(intervalId));

const loading = ref(false);
async function submit() {
  if (!emailVerifyToken.value) {
    commonStore.alert("请重新获取邮箱验证码");
    return;
  }
  if (emailVerificationUserAnswer.value.length === 0) {
    commonStore.alert("请填写邮箱验证码");
    return;
  }
  try {
    loading.value = true;
    const jwt = await backend.auth.login(
      email.value,
      emailVerificationUserAnswer.value,
      emailVerifyToken.value
    );
    commonStore.jwt = jwt;
    commonStore.showLoginPanel = false;
    email.value = "";
    userCaptchaAnswer.value = "";
    emailVerificationUserAnswer.value = "";
    captcha.value = undefined;
  } catch (err) {
    commonStore.alert(String(err));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    v-if="commonStore.showLoginPanel"
    class="fixed inset-0 z-10 m-auto h-[20rem] w-[28rem] rounded-xl border-2 border-neutral-400 bg-black bg-opacity-50 backdrop-blur-xl"
  >
    <div class="my-6 mx-8 flex text-center text-2xl font-bold">
      <div class="grow py-1">登录</div>
    </div>

    <div class="flex h-32 flex-col justify-center">
      <div class="my-2">
        <label for="email" class="inline-block w-24 text-center">邮箱</label>
        <input
          id="email"
          type="email"
          v-model="email"
          class="h-8 w-72 rounded-sm bg-neutral-600 px-2 leading-8 focus:outline-none"
        />
      </div>
      <div class="my-2">
        <span class="inline-block w-24"></span>
        <span
          id="captcha-container"
          v-html="captcha?.captchaSVG || ''"
          @click="fetchCaptcha"
        ></span>
        <input
          type="text"
          v-model="userCaptchaAnswer"
          class="mx-2 inline-block h-8 w-20 rounded-sm bg-neutral-600 px-2 leading-8 focus:outline-none"
        />
        <button
          :class="[
            'w-28 rounded-sm bg-neutral-600 py-1 hover:bg-green-600',
            {
              'hover:bg-yellow-400': emailVerificationCountdown > 0,
            },
          ]"
          @click="sendEmailVerification"
        >
          {{
            emailVerificationCountdown > 0
              ? emailVerificationCountdown
              : "发送验证码"
          }}
        </button>
      </div>
      <div class="my-2">
        <label for="verify-code" class="inline-block w-24 text-center"
          >验证码</label
        >
        <input
          id="verify-code"
          type="text"
          v-model="emailVerificationUserAnswer"
          class="h-8 w-72 rounded-sm bg-neutral-600 px-2 leading-8 focus:outline-none"
        />
      </div>
    </div>

    <button
      class="mx-auto mt-4 block w-32 bg-neutral-600 py-1 text-lg font-bold hover:bg-apex-red"
      @click="submit"
    >
      {{ loading ? "登录中..." : "提交" }}
    </button>

    <div
      class="absolute top-0 -right-10 flex h-8 w-8 flex-col justify-center rounded bg-black bg-opacity-50 backdrop-blur-md hover:bg-apex-red"
      @click="commonStore.showLoginPanel = false"
    >
      <Close class="mx-1 block" size="24" fill="white" />
    </div>
  </div>
</template>

<style>
#captcha-container svg {
  display: inline-block;
  height: 2rem;
  width: 5rem;
  background: white;
  border-radius: 2px;
  position: relative;
  bottom: 1px;
}
</style>
