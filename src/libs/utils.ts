import { useCommonStore } from "../stores/common-store";

export interface ExtractedTcbError {
  err: string;
  code: string;
  msg: string;
}

export const KnownTcbErrors: Record<string, string> = {
  102001: "用户名与密码不匹配",
  102002: "用户已存在",
  102003: "用户不存在或未激活",
};

export function extractTcbErrorMessage(
  error: any
): ExtractedTcbError | undefined {
  const match = error.message.match(/^\[(.+)\] \[(.+)\] (.+)$/);
  return match
    ? {
        err: match[1] ?? "",
        code: match[2] ?? "",
        msg: match[3] ?? "",
      }
    : undefined;
}

export function handleTcbError(
  commonStore: ReturnType<typeof useCommonStore>,
  error: any
) {
  const err = extractTcbErrorMessage(error);
  if (!err || !KnownTcbErrors[err.code]) {
    commonStore.alert(`发生未知错误：${err?.msg ?? error.message}`);
    // TODO: Add error report logic.
    throw error;
  }
  commonStore.alert(KnownTcbErrors[err.code]);
}

export function throttle(fn: (e: any) => void, delay = 500) {
  let inDelay = false;
  return (e: any) => {
    if (inDelay) {
      return;
    } else {
      inDelay = true;
      setTimeout(() => {
        fn(e);
        inDelay = false;
      }, delay);
    }
  };
}
