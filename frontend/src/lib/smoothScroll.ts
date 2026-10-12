import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/**
 * Initialize Lenis ultra-smooth scrolling with natural easing similar to Apple, Linear, and Stripe.
 */
export function initSmoothScroll(): Lenis {
  if (typeof window === "undefined") return null as unknown as Lenis;
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Natural exponential ease-out
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    touchMultiplier: 1.5,
    wheelMultiplier: 0.95,
  });

  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Global anchor click handler for seamless smooth scrolling
  const handleAnchorClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;
    const href = target.getAttribute("href");
    if (href && href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      scrollToTarget(href, -78);
    }
  };

  document.addEventListener("click", handleAnchorClick);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Programmatically scroll to target with smooth easing and custom navbar offset.
 */
export function scrollToTarget(target: string | HTMLElement, offset: number = -78) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;
    if (element) {
      const top =
        element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
}
