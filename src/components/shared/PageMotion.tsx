'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Reveal newly visible content without hiding it when JS or motion is unavailable. */
export function PageMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new WeakSet<Element>();
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }, index) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (preference.matches || document.documentElement.dataset.design !== 'gossaem') return;
        const movable = target.matches('article, .joy-step, .soft-card-shadow, .wishlist-card, [data-motion-card]') && !target.querySelector('.fixed, .sticky');
        const animation = target.animate(
          movable ? [{ opacity: .2, translate: '0 28px', scale: '.97' }, { opacity: 1, translate: '0 0', scale: '1' }] : [{ opacity: .2 }, { opacity: 1 }],
          { duration: 700, delay: Math.min(index * 75, 225), easing: 'cubic-bezier(.16,1,.3,1)' },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: .08 });
    const scan = () => {
      document.querySelectorAll('main > section, main > div > section, main article, .joy-step, .soft-card-shadow, .wishlist-card, [data-motion-card]').forEach((element) => {
        if (!seen.has(element)) { seen.add(element); observer.observe(element); }
      });
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });
    const stop = () => { animations.forEach((animation) => animation.cancel()); animations.clear(); };
    const feedback = (event: MouseEvent) => {
      if (preference.matches || document.documentElement.dataset.design !== 'gossaem') return;
      const target = (event.target as Element).closest('button, a');
      if (!target || target.matches(':disabled, [aria-disabled="true"]') || !target.textContent?.trim()) return;
      const box = target.getBoundingClientRect();
      if (box.width > 500 || box.height > 140) return;
      const animation = target.animate([{ scale: '1' }, { scale: '.94', offset: .25 }, { scale: '1.04', offset: .7 }, { scale: '1' }], { duration: 380, easing: 'ease-out' });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    document.addEventListener('click', feedback);
    preference.addEventListener('change', stop);
    return () => { observer.disconnect(); mutations.disconnect(); document.removeEventListener('click', feedback); preference.removeEventListener('change', stop); stop(); };
  }, [pathname]);

  return null;
}
