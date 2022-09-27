import { InjectionKey } from "vue";
import cloudbase from "@cloudbase/js-sdk";

export const TCB_APP = Symbol() as InjectionKey<cloudbase.app.App>;
