import { InjectionKey } from "vue";
import cloudbase from "@cloudbase/js-sdk";

export const TCB_APP = Symbol("TCB_APP") as InjectionKey<cloudbase.app.App>;
