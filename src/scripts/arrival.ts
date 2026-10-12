// One-off arrivals, timed by when something is seen. whenSeen marks an element
// that starts off screen data-arrival="waiting" and resolves true once `share`
// of it is in; the caller then arrive()s it for its CSS to play. Already on
// screen at load, or with reduced motion, it resolves false and nothing changes.

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

// A token from tokens.css, for motion run from a script
export const token = (name: string, fallback = '') =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export function whenSeen(el: HTMLElement, share = 0.25): Promise<boolean> {
  if (reducedMotion.matches) return Promise.resolve(false);

  return new Promise((resolve) => {
    const io = new IntersectionObserver(
      ([{ isIntersecting, intersectionRatio }]) => {
        if (!el.dataset.arrival) {
          // First report: only wait if it's nowhere on the page yet
          if (isIntersecting) {
            io.disconnect();
            resolve(false);
            return;
          }
          el.dataset.arrival = 'waiting';
        }
        if (intersectionRatio >= share) {
          io.disconnect();
          resolve(true);
        }
      },
      { threshold: [0, share] },
    );
    io.observe(el);
  });
}

export const arrive = (el: HTMLElement) => {
  el.dataset.arrival = 'arrived';
};
