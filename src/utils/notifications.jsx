export const waitForSWController = () =>
  new Promise((resolve) => {
    if (navigator.serviceWorker.controller) {
      resolve(true);
      return;
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => resolve(true),
      { once: true }
    );
  });