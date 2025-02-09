export const useFullscreen = () => {
  const enterFullscreen = () => {
    const elem: HTMLElement = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else if (
      (elem as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> })
        .webkitRequestFullscreen
    ) {
      (
        elem as HTMLElement & { webkitRequestFullscreen: () => Promise<void> }
      ).webkitRequestFullscreen();
    } else if (
      (elem as HTMLElement & { mozRequestFullScreen?: () => Promise<void> })
        .mozRequestFullScreen
    ) {
      (
        elem as HTMLElement & { mozRequestFullScreen: () => Promise<void> }
      ).mozRequestFullScreen();
    } else if (
      (elem as HTMLElement & { msRequestFullscreen?: () => Promise<void> })
        .msRequestFullscreen
    ) {
      (
        elem as HTMLElement & { msRequestFullscreen: () => Promise<void> }
      ).msRequestFullscreen();
    }
  };
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (
      (document as Document & { webkitExitFullscreen?: () => Promise<void> })
        .webkitExitFullscreen
    ) {
      (
        document as Document & { webkitExitFullscreen: () => Promise<void> }
      ).webkitExitFullscreen();
    } else if (
      (document as Document & { mozCancelFullScreen?: () => Promise<void> })
        .mozCancelFullScreen
    ) {
      (
        document as Document & { mozCancelFullScreen: () => Promise<void> }
      ).mozCancelFullScreen();
    } else if (
      (document as Document & { msExitFullscreen?: () => Promise<void> })
        .msExitFullscreen
    ) {
      (
        document as Document & { msExitFullscreen: () => Promise<void> }
      ).msExitFullscreen();
    }
  };
  return { enterFullscreen, exitFullscreen };
};
