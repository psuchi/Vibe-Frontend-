import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.sr');

    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove('hidden');
            e.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => {
      // Mark as hidden so the animation plays, but only if not already visible
      if (!el.classList.contains('visible')) {
        el.classList.add('hidden');
      }
      revealObs.observe(el);
    });

    return () => revealObs.disconnect();
  });
}
