import { boolean } from "mathjs";
import { defineStore } from "pinia";
import { readonly, ref } from "vue";

interface ConfirmData {
  title: string;
  text: string;
}

export const useConfirmStore = defineStore("confirm", () => {
  const confirmData = ref<ConfirmData>();
  const resolveConfirmationResult = ref<
    ((confirmed: boolean) => void) | undefined
  >();
  const getUserConfirmation = async (_confirmData: ConfirmData) => {
    confirmData.value = _confirmData;
    return await new Promise<boolean>((resolve) => {
      resolveConfirmationResult.value = (confirmed: boolean) => {
        confirmData.value = undefined;
        resolve(confirmed);
      };
    });
  };
  return {
    getUserConfirmation,
    confirmData: readonly(confirmData),
    resolveConfirmationResult,
  };
});
