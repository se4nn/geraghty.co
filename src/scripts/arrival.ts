export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export const token = (name: string, fallback = '') =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export const ms = (name: string, fallback: number) => {
  const value = token(name);
  const n = parseFloat(value);
  if (Number.isNaN(n)) return fallback;
  return value.endsWith('ms') ? n : value.endsWith('s') ? n * 1000 : n;
};

export function whenSeen(el: HTMLElement, share = 0.25): Promise<boolean> {
  if (reducedMotion.matches) return Promise.resolve(false);

  return new Promise((resolve) => {
    const io = new IntersectionObserver(
      ([{ isIntersecting, intersectionRatio }]) => {
        if (!el.dataset.arrival) {
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
