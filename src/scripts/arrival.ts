// One-off arrivals, timed by when something is actually seen.
//
// An element that is off the page when it loads is marked
// data-arrival="waiting", and the promise resolves true once enough of it has
// scrolled in; the caller then marks it "arrived" (straight away, or after
// whatever it should follow), for the component's CSS to play its entrance.
// Anything already on the page at load resolves false and is left alone, so
// nothing that's visible changes under the reader. With reduced motion, or no
// script, nothing is marked and everything is simply there.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
