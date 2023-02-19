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
