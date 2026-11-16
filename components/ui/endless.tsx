"use client";

import { gsap } from "gsap";
import { Globe } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Testimonial } from "@/content/testimonials";

// An endless 3D corridor: testimonial cards drift from the far distance past the viewer,
// alternating left and right walls. Adapted from the "Endless" GSAP component, with cards
// in place of stock images, theme tokens, an off-screen pause and reduced-motion support.

const Z_FAR = -2400;
const Z_NEAR = 780;
const RANGE = Z_NEAR - Z_FAR;
const DURATION = 22;
const FADE_IN = 0.08;
const FADE_OUT = 0.05;
// Enough planes to fill the corridor; short lists repeat.
const MIN_PLANES = 10;

const css = `
.endless-root{position:relative;isolation:isolate;width:100%;height:min(100svh,880px);min-height:520px;overflow:hidden;
  background:radial-gradient(ellipse at 50% 50%,color-mix(in oklab,var(--brand-navy) 55%,var(--bg)) 0%,var(--bg) 70%);
  color:var(--ink);user-select:none;-webkit-user-select:none}
.endless-scene{position:absolute;inset:0;perspective:1100px;perspective-origin:50% 50%;transform-style:preserve-3d;pointer-events:none}
.endless-world{position:absolute;inset:0;transform:translate3d(0,0,0);transform-style:preserve-3d}
.endless-plane{position:absolute;top:50%;left:50%;transform-style:preserve-3d;transform-origin:50% 50%;backface-visibility:hidden;-webkit-backface-visibility:hidden;will-change:transform}
.endless-card{display:flex;flex-direction:column;width:100%;height:100%;padding:1.4em;border-radius:1em;
  border:1px solid color-mix(in oklab,var(--brand-gold) 28%,var(--line));
  background:linear-gradient(160deg,color-mix(in oklab,var(--surface) 92%,var(--brand-gold)) 0%,var(--surface) 55%,color-mix(in oklab,var(--surface) 85%,var(--brand-navy)) 100%);
  box-shadow:0 1.5em 3em -1em rgb(0 0 0/.45);transform:translateZ(0)}
.endless-mark{font-family:var(--font-general-sans),serif;font-size:3.2em;line-height:.8;height:.55em;color:var(--brand-gold)}
.endless-quote{margin-top:.7em;font-size:1em;line-height:1.45;color:var(--ink);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:8;overflow:hidden}
.endless-by{margin-top:auto;padding-top:.9em;border-top:1px solid var(--line)}
.endless-name{font-family:var(--font-general-sans),sans-serif;font-weight:600;font-size:1em;color:var(--ink)}
.endless-role{margin-top:.25em;font-size:.82em;line-height:1.35;color:var(--muted)}
.endless-title{position:absolute;top:50%;left:50%;z-index:2000;transform:translate(-50%,-50%);margin:0;max-width:min(90%,34rem);text-align:center;
  font-family:var(--font-general-sans),sans-serif;font-weight:600;font-size:clamp(1.5rem,4.2vw,3rem);line-height:1.05;letter-spacing:-.02em;color:var(--ink);
  text-shadow:0 2px 24px var(--bg)}
.endless-footer{position:absolute;bottom:2rem;left:50%;z-index:2000;display:flex;flex-direction:column;align-items:center;gap:.5rem;transform:translateX(-50%);color:var(--muted);pointer-events:none}
.endless-caption{font-size:.875rem;font-weight:500;letter-spacing:.04em;line-height:1.3;text-align:center;white-space:nowrap}
/* iOS WebKit flattens nested 3D when an ancestor uses overflow:hidden. */
@supports (-webkit-touch-callout:none){.endless-root{overflow:visible;clip-path:inset(0)}}
`;

function opacityForProgress(progress: number) {
  if (progress < FADE_IN) return Math.max(0, progress / FADE_IN);
  if (progress > 1 - FADE_OUT) return Math.max(0, (1 - progress) / FADE_OUT);
  return 1;
}

function getLayout(width: number) {
  // Cards carry text, so they stay larger than the original image planes on phones.
  const planeW = width < 768 ? Math.min(width * 0.44, 240) : Math.min(width * 0.27, 420);
  return {
    planeW,
    planeH: planeW * (4 / 3),
    offsetX: width < 768 ? width * 0.3 : width * 0.33,
    angle: width < 768 ? 18 : 24,
    fontSize: planeW * 0.058,
  };
}

function planesFor(items: Testimonial[]) {
  if (items.length === 0) return [];
  const count = Math.max(MIN_PLANES, items.length + (items.length % 2));
  return Array.from({ length: count }, (_, index) => items[index % items.length]!);
}

export function Endless({
  items,
  title,
  caption,
}: {
  items: Testimonial[];
  title: string;
  caption?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const planes = planesFor(items);
  const total = planes.length;

  useEffect(() => {
    const root = rootRef.current;
    const world = worldRef.current;
    if (!root || !world || total === 0) return;

    const nodes = Array.from(world.querySelectorAll<HTMLElement>(".endless-plane"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tweens: gsap.core.Tween[] = [];

    const applyLayout = () => {
      const { planeW, planeH, offsetX, angle, fontSize } = getLayout(root.clientWidth);
      nodes.forEach((plane, index) => {
        const isLeft = index % 2 === 0;
        plane.style.width = `${planeW}px`;
        plane.style.height = `${planeH}px`;
        plane.style.fontSize = `${fontSize}px`;
        gsap.set(plane, {
          xPercent: -50,
          yPercent: -50,
          x: isLeft ? -offsetX : offsetX,
          y: 0,
          rotationY: isLeft ? angle : -angle,
          force3D: true,
        });
      });
    };

    applyLayout();

    nodes.forEach((plane, index) => {
      const card = plane.firstElementChild as HTMLElement;
      const startProgress = index / total;

      gsap.set(plane, { z: Z_FAR + startProgress * RANGE });
      card.style.opacity = String(opacityForProgress(startProgress));
      plane.style.zIndex = String(Math.round(startProgress * 1000));

      if (reduceMotion) return;

      const tween = gsap.fromTo(
        plane,
        { z: Z_FAR },
        {
          z: Z_NEAR,
          duration: DURATION,
          ease: "none",
          repeat: -1,
          immediateRender: false,
          paused: true,
          onUpdate() {
            const progress = this.progress();
            card.style.opacity = String(opacityForProgress(progress));
            plane.style.zIndex = String(Math.round(progress * 1000));
          },
        },
      );
      tween.progress(startProgress);
      tweens.push(tween);
    });

    // Only animate while the corridor is on screen.
    const observer = new IntersectionObserver(
      ([entry]) =>
        tweens.forEach((tween) => (entry?.isIntersecting ? tween.play() : tween.pause())),
      { threshold: 0.05 },
    );
    observer.observe(root);

    const resize = new ResizeObserver(applyLayout);
    resize.observe(root);

    return () => {
      observer.disconnect();
      resize.disconnect();
      tweens.forEach((tween) => tween.kill());
      gsap.killTweensOf(nodes);
    };
  }, [total]);

  return (
    <section ref={rootRef} className="endless-root" aria-labelledby="endless-title">
      <style href="endless-corridor" precedence="default">
        {css}
      </style>
      {/* Decorative: the same quotes are listed as text below the corridor. */}
      <div className="endless-scene" aria-hidden="true">
        <div className="endless-world" ref={worldRef}>
          {planes.map((item, index) => (
            <div className="endless-plane" key={`${item.name}-${index}`}>
              <figure className="endless-card">
                <span className="endless-mark">&ldquo;</span>
                <blockquote className="endless-quote">{item.quote}</blockquote>
                <figcaption className="endless-by">
                  <p className="endless-name">{item.name}</p>
                  <p className="endless-role">
                    {item.role}, {item.company}
                  </p>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
      <h2 id="endless-title" className="endless-title">
        {title}
      </h2>
      {caption ? (
        <div className="endless-footer">
          <Globe className="size-6" strokeWidth={1} aria-hidden />
          <p className="endless-caption">{caption}</p>
        </div>
      ) : null}
    </section>
  );
}

export default Endless;
