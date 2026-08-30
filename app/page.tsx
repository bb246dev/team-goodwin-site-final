'use client';

import { useEffect, useRef, useState } from 'react';

type RGB = [number, number, number];
type Palette = { base: RGB; glowOne: RGB; glowTwo: RGB; ink: RGB };

const palettes: Palette[] = [
  { base: [8, 15, 32], glowOne: [27, 48, 88], glowTwo: [14, 72, 72], ink: [243, 246, 251] },
  { base: [38, 65, 81], glowOne: [76, 112, 128], glowTwo: [91, 92, 135], ink: [247, 249, 247] },
  { base: [218, 211, 192], glowOne: [239, 223, 184], glowTwo: [184, 203, 196], ink: [30, 38, 45] },
  { base: [244, 232, 210], glowOne: [242, 197, 167], glowTwo: [202, 216, 205], ink: [40, 37, 39] },
  { base: [119, 71, 90], glowOne: [169, 104, 99], glowTwo: [68, 90, 115], ink: [252, 243, 239] },
  { base: [19, 22, 42], glowOne: [55, 38, 78], glowTwo: [13, 55, 68], ink: [246, 244, 249] },
];

const sections = [
  { eyebrow: '01 / Nocturne', title: 'A quiet beginning.', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo sed erat ultrices posuere. Nulla facilisi. Praesent commodo, sapien vel viverra luctus, neque lorem posuere sem.' },
  { eyebrow: '02 / Blue hour', title: 'The atmosphere begins to lift.', body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Curabitur blandit tempus porttitor. Vestibulum id ligula porta felis euismod semper.' },
  { eyebrow: '03 / Daylight', title: 'Space opens around the words.', body: 'Maecenas faucibus mollis interdum. Donec ullamcorper nulla non metus auctor fringilla. Aenean lacinia bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod.' },
  { eyebrow: '04 / Warmth', title: 'Light reaches its softest point.', body: 'Cras mattis consectetur purus sit amet fermentum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.' },
  { eyebrow: '05 / Afterglow', title: 'Color gathers, slowly and deeply.', body: 'Nullam quis risus eget urna mollis ornare vel eu leo. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Duis mollis, est non commodo luctus.' },
  { eyebrow: '06 / Return', title: 'Then the page settles into night.', body: 'Donec sed odio dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nulla vitae elit libero, a pharetra augue.' },
];

function mix(start: RGB, end: RGB, amount: number): RGB {
  return start.map((channel, index) => Math.round(channel + (end[index] - channel) * amount)) as RGB;
}

const rgb = (value: RGB) => value.join(' ');
const smoothstep = (value: number) => value * value * (3 - 2 * value);

export default function Home() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pageProgress = maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0;
      const position = pageProgress * (palettes.length - 1);
      const index = Math.min(Math.floor(position), palettes.length - 2);
      const localProgress = smoothstep(position - index);
      const current = palettes[index];
      const next = palettes[index + 1];
      const background = backgroundRef.current;

      if (background) {
        background.style.setProperty('--base', rgb(mix(current.base, next.base, localProgress)));
        background.style.setProperty('--glow-one', rgb(mix(current.glowOne, next.glowOne, localProgress)));
        background.style.setProperty('--glow-two', rgb(mix(current.glowTwo, next.glowTwo, localProgress)));
        document.documentElement.style.setProperty('--ink', rgb(mix(current.ink, next.ink, localProgress)));
      }
      setProgress(pageProgress);
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main>
      <div ref={backgroundRef} className="ambient-background" aria-hidden="true">
        <div className="ambient-grain" />
      </div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Color study, back to top">COLOR / STUDY</a>
        <span className="header-note">A scroll experiment</span>
        <div className="progress-track" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
      </header>
      <div id="top">
        {sections.map((section, index) => (
          <section className="story-section" key={section.eyebrow}>
            <div className="section-content">
              <p className="eyebrow">{section.eyebrow}</p>
              <h1>{section.title}</h1>
              <p className="body-copy">{section.body}</p>
            </div>
            <span className="section-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            {index === 0 && <div className="scroll-cue" aria-hidden="true"><span>Scroll to shift the light</span><i /></div>}
          </section>
        ))}
      </div>
    </main>
  );
}
