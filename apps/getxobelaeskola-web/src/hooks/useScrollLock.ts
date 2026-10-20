import { useEffect, RefObject } from 'react';

export function useScrollLock(ref: RefObject<HTMLElement>, isOpen: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      const isScrollable = el.scrollHeight > el.clientHeight;
      
      if (!isScrollable) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const isAtTop = el.scrollTop === 0;
      const isAtBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1;

      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Simplified touch lock
      const isScrollable = el.scrollHeight > el.clientHeight;
      if (!isScrollable) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        e.stopPropagation();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [ref, isOpen]);
}
