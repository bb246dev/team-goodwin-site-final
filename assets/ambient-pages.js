(() => {
  const BLACK = { base: [6, 14, 15], glowOne: [18, 38, 34], glowTwo: [24, 34, 47] };
  const WHITE = { base: [240, 241, 235], glowOne: [255, 251, 239], glowTwo: [207, 225, 218] };
  const GREEN = { base: [25, 59, 59], glowOne: [52, 96, 82], glowTwo: [45, 66, 78] };
  const palettes = [BLACK, BLACK, WHITE, GREEN, WHITE, BLACK];
  const anchorSelectors = [".hero", ".grid", ".body", ".schedule", ".faq-list", ".legal-copy", ".site-footer", ".global-site-footer"];
  const LIGHT_INK = [248, 247, 239];
  const DARK_INK = [9, 31, 29];

  const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
  const mix = (start, end, amount) => start.map((channel, index) => channel + (end[index] - channel) * amount);
  const smoothstep = (value) => value * value * (3 - 2 * value);
  const rgb = (value) => value.map(Math.round).join(" ");
  const relativeLuminance = (color) => {
    const channels = color.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const background = document.createElement("div");
  background.className = "ambient-pages-background";
  background.setAttribute("aria-hidden", "true");
  document.body.prepend(background);
  document.body.classList.add("has-ambient-pages");

  const trackerNav = document.querySelector(".tracker-nav");
  const trackerMenuToggle = document.querySelector(".tracker-menu-toggle");
  if (trackerNav && trackerMenuToggle) {
    trackerMenuToggle.addEventListener("click", () => {
      const isOpen = trackerNav.classList.toggle("is-open");
      trackerMenuToggle.setAttribute("aria-expanded", String(isOpen));
      trackerMenuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });
    trackerNav.querySelectorAll(".tracker-navlinks a").forEach((link) => {
      link.addEventListener("click", () => {
        trackerNav.classList.remove("is-open");
        trackerMenuToggle.setAttribute("aria-expanded", "false");
        trackerMenuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  if (trackerNav) {
    const desktopQuery = window.matchMedia("(min-width: 769px)");
    const updateNavFade = () => {
      trackerNav.classList.toggle("is-scrolled", desktopQuery.matches && window.scrollY > 180);
    };

    updateNavFade();
    window.addEventListener("scroll", updateNavFade, { passive: true });
    desktopQuery.addEventListener?.("change", updateNavFade);
  }

  let anchors = [];
  let frame = 0;
  let targetScroll = window.scrollY;
  let renderedScroll = targetScroll;
  let scrollVelocity = 0;
  let previousTime = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const measure = () => {
    anchors = anchorSelectors
      .map((selector) => document.querySelector(selector))
      .filter(Boolean)
      .map((element) => element.getBoundingClientRect().top + window.scrollY);

    if (!anchors.length) anchors = [0, document.documentElement.scrollHeight];
  };

  const paletteAt = (scrollPosition) => {
    const focus = scrollPosition + window.innerHeight * 0.46;
    let index = 0;
    while (index < anchors.length - 1 && focus >= anchors[index + 1]) index += 1;
    const end = anchors[index + 1] ?? document.documentElement.scrollHeight;
    const start = anchors[index] ?? 0;
    const interval = Math.max(1, end - start);
    const amount = smoothstep(clamp((focus - start) / interval));
    const current = palettes[Math.min(index, palettes.length - 1)];
    const next = palettes[Math.min(index + 1, palettes.length - 1)];
    return {
      base: mix(current.base, next.base, amount),
      glowOne: mix(current.glowOne, next.glowOne, amount),
      glowTwo: mix(current.glowTwo, next.glowTwo, amount),
    };
  };

  const render = () => {
    frame = 0;
    if (anchors.length < 2) measure();
    targetScroll = window.scrollY;
    const now = performance.now();
    const deltaTime = previousTime ? Math.min(0.032, (now - previousTime) / 1000) : 1 / 60;
    previousTime = now;

    if (reducedMotion.matches) {
      renderedScroll = targetScroll;
      scrollVelocity = 0;
    } else {
      const displacement = targetScroll - renderedScroll;
      scrollVelocity += displacement * 15 * deltaTime;
      scrollVelocity *= Math.exp(-4.8 * deltaTime);
      renderedScroll += scrollVelocity * deltaTime;
      if (Math.abs(displacement) < 0.1 && Math.abs(scrollVelocity) < 0.1) {
        renderedScroll = targetScroll;
        scrollVelocity = 0;
      }
    }

    const palette = paletteAt(renderedScroll);
    const baseLuminance = relativeLuminance(palette.base);
    const inkAmount = smoothstep(clamp((0.52 - baseLuminance) / 0.48));
    const phase = renderedScroll / Math.max(720, window.innerHeight * 1.08);
    document.documentElement.style.setProperty("--ambient-base", rgb(palette.base));
    document.documentElement.style.setProperty("--ambient-glow-one", rgb(palette.glowOne));
    document.documentElement.style.setProperty("--ambient-glow-two", rgb(palette.glowTwo));
    document.documentElement.style.setProperty("--ambient-ink", rgb(mix(DARK_INK, LIGHT_INK, inkAmount)));
    document.documentElement.style.setProperty("--ambient-page-drift-x", `${Math.sin(phase * 0.62) * window.innerWidth * 0.045}px`);
    document.documentElement.style.setProperty("--ambient-page-drift-y", `${Math.cos(phase * 0.5) * 30}px`);
    document.documentElement.style.setProperty("--ambient-page-scale", `${1.06 + Math.sin(phase * 0.35) * 0.03}`);

    if (!reducedMotion.matches && (Math.abs(targetScroll - renderedScroll) >= 0.1 || Math.abs(scrollVelocity) >= 0.1)) {
      frame = requestAnimationFrame(render);
    }
  };

  const requestRender = () => {
    targetScroll = window.scrollY;
    if (!frame) frame = requestAnimationFrame(render);
  };
  measure();
  render();
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", () => { measure(); requestRender(); });
  window.addEventListener("load", () => { measure(); requestRender(); }, { once: true });
  reducedMotion.addEventListener("change", requestRender);
})();
