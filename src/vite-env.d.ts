/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_TCB_ENV_ID?: string;
  readonly VITE_TCB_REGION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
