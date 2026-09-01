import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const publicRootFiles = ["robots.txt", "sitemap.xml", ".htaccess"];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });
cpSync(join(root, "fonts"), join(dist, "fonts"), { recursive: true });
if (existsSync(join(root, "api"))) {
  cpSync(join(root, "api"), join(dist, "api"), { recursive: true });
}
for (const file of publicRootFiles) {
  if (existsSync(join(root, file))) {
    cpSync(join(root, file), join(dist, file));
  }
}

const pages = [
  ["source-html/live-tracking.html", "index.html"],
  ["source-html/athletes.raw.html", "athletes.html"],
  ["source-html/partners.raw.html", "partners.html"],
  ["source-html/live-tracking.html", "live-tracking.html"],
  ["source-html/the-run.raw.html", "the-run.html"],
  ["source-html/will.raw.html", "will.html"],
  ["source-html/fifty-runs.raw.html", "fifty-runs.html"],
  ["source-html/updates.raw.html", "updates.html"],
  ["source-html/faq.raw.html", "faq.html"],
  ["source-html/week-1.raw.html", "week-1.html"],
  ["source-html/week-2.raw.html", "week-2.html"],
  ["source-html/week-3.raw.html", "week-3.html"],
  ["source-html/privacy.raw.html", "privacy.html"],
  ["source-html/terms.raw.html", "terms.html"],
  ["source-html/participation-terms.raw.html", "participation-terms.html"],
  ["source-html/accessibility.raw.html", "accessibility.html"],
];

const videoIds = [
  "n4ryq66g73w",
  "0pSyTZX-W_k",
  "fmmMVWg0PSM",
  "OHphcj4Iyr0",
  "tjtq4HcwsHA",
  "uhlS676VCBQ",
  "6WUDZK1pE4s",
  "infIn5eDK1o",
  "T6YC-CgVOvo",
  "epjHuFVRMGs",
  "ApDPZUyHV6Y",
  "CupDgn2O1Vw",
];

const sharedFooterCss = `
    .global-site-footer{width:min(1180px,calc(100% - clamp(44px,10vw,144px)));margin:78px auto 0;border-top:1px solid rgba(20,63,60,.18);color:#143f3c}
    .global-site-footer-main{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(0,2.1fr);gap:clamp(32px,6vw,86px);padding:56px 0}
    .global-site-footer-nav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:start;gap:clamp(24px,4vw,64px)}
    .global-site-footer-brand{max-width:260px}
    .global-site-footer-brand img{display:block;width:100%;height:auto}
    .global-site-footer p{max-width:30rem;margin-top:14px;color:rgba(20,63,60,.68);line-height:1.55}
    .global-site-footer ul{display:grid;gap:10px;margin:0;padding:0;list-style:none}
    .global-site-footer a,.global-site-footer-link-disabled{color:rgba(20,63,60,.68);text-decoration:none;white-space:nowrap}
    .global-site-footer a:hover{color:#1c6f4a}
    .global-site-footer-legal{display:flex;flex-wrap:wrap;gap:12px 22px;padding:0 0 28px;color:rgba(20,63,60,.62);font-size:.78rem;line-height:1.5}
    .global-site-footer-disclaimer{max-width:980px;margin:0 0 30px;color:rgba(20,63,60,.58);font-size:.72rem;line-height:1.55}
    .global-site-footer-bottom{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 0;border-top:1px solid rgba(20,63,60,.18);color:rgba(20,63,60,.62);font-size:.8rem}
    .global-site-footer-partners{margin-top:4px;padding:42px clamp(24px,4vw,48px) 46px;border-top:1px solid rgba(255,255,255,.16);background:#0a0a0a;color:#fff}
    .global-site-footer-partners .tracker-eyebrow{color:rgba(255,255,255,.78);text-align:center}
    .global-site-footer .global-site-footer-partner-disclaimer{max-width:620px;margin:30px auto 0;color:rgba(255,255,255,.56);font-size:.68rem;line-height:1.45;text-align:center}
    .partner-logo-wall{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));align-items:center;justify-items:center;column-gap:32px;row-gap:34px;margin-top:38px}
    .partner-logo-item{display:flex;grid-column:span 2;align-items:center;justify-content:center;min-width:0}
    .partner-logo-item a{display:flex;align-items:center;justify-content:center;min-width:0}
    .partner-logo-item img{display:block;width:auto;max-width:min(168px,100%);max-height:34px;object-fit:contain;opacity:.76;transition:opacity 160ms ease}
    .partner-logo-item a:hover img,.partner-logo-item a:focus-visible img{opacity:1}
    @media(min-width:941px){.partner-logo-item{grid-column:auto;min-height:42px}.partner-logo-item:nth-child(1){order:1}.partner-logo-item:nth-child(2){order:2}.partner-logo-item:nth-child(4){order:3}.partner-logo-item:nth-child(5){order:4}.partner-logo-item:nth-child(6){order:5}.partner-logo-item:nth-child(7){order:6}.partner-logo-item:nth-child(8){order:7}.partner-logo-item:nth-child(9){order:8}.partner-logo-item:nth-child(10){order:9}.partner-logo-item:nth-child(11){order:10}.partner-logo-item:nth-child(3){order:11}.partner-logo-item:nth-child(12){order:12}.partner-logo-item:nth-child(13){order:13}.partner-logo-item:nth-child(14){order:14}.partner-logo-item:nth-child(15){order:15}}
    @media(max-width:840px){.global-site-footer-main{grid-template-columns:1fr}.global-site-footer-bottom{display:block}}
    @media(max-width:430px){.global-site-footer-nav{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;font-size:.72rem;line-height:1.25}.global-site-footer-link-group{gap:6px}.global-site-footer-nav a,.global-site-footer-link-disabled{display:flex;align-items:center;min-height:34px;white-space:normal}.global-site-footer-partners{margin-inline:0;padding:32px 0 34px;overflow:visible}.global-site-footer-partners .tracker-eyebrow{padding-inline:20px;text-align:left}.partner-logo-wall{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%;max-width:100%;align-items:center;justify-items:center;column-gap:22px;row-gap:28px;margin-top:28px;padding:0 20px 4px;overflow:visible}.partner-logo-item{grid-column:auto;min-height:30px}.partner-logo-item:nth-child(15){grid-column:1 / -1}.partner-logo-item img{max-width:92px;max-height:26px;opacity:.78}}`;

const sharedFooterHtml = `
  <footer class="global-site-footer">
    <div class="global-site-footer-main">
      <div>
        <div class="global-site-footer-brand"><img src="/assets/goodwin-logo.png" alt="Goodwin" width="2000" height="304"></div>
      </div>
      <nav class="global-site-footer-nav" aria-label="Footer navigation">
        <ul class="global-site-footer-link-group">
      <li><a href="/the-run/">The Run</a></li>
      <li><a href="/#map">Live Map</a></li>
      <li><a href="/updates/">Running Live Archive</a></li>
      <li><a href="/fifty-runs/">50 Runs, 50 States</a></li>
        </ul>
        <ul class="global-site-footer-link-group">
          <li><a href="https://www.instagram.com/williamgoodge/" target="_blank" rel="noopener noreferrer">Will's Instagram</a></li>
          <li><a href="https://www.tiktok.com/@williamgoodge?_r=1&amp;_t=ZP-99HtuOCkdiA" target="_blank" rel="noopener noreferrer">Will's TikTok</a></li>
          <li><a href="https://www.youtube.com/@goodge" target="_blank" rel="noopener noreferrer">Will's YouTube</a></li>
          <li><a href="https://rizkia.com/" target="_blank" rel="noopener noreferrer">Rizkia</a></li>
          <li><a href="https://live-mission-america-50.pantheonsite.io/#faq" target="_blank" rel="noopener noreferrer">WilliamGoodge.com</a></li>
        </ul>
        <ul class="global-site-footer-link-group">
          <li><a href="https://www.linkedin.com/company/teamgoodwin/" target="_blank" rel="noopener noreferrer">Goodwin's LinkedIn</a></li>
          <li><a href="https://www.youtube.com/@goodwinsoftwarecompany" target="_blank" rel="noopener noreferrer">Goodwin's YouTube</a></li>
          <li><a href="https://x.com/goteamgoodwin" target="_blank" rel="noopener noreferrer">Goodwin's X</a></li>
          <li><a href="https://teamgoodwin.com/" target="_blank" rel="noopener noreferrer">TeamGoodwin.com</a></li>
          <li><a href="mailto:run@teamgoodwin.com">Contact</a></li>
        </ul>
      </nav>
    </div>
    <div class="global-site-footer-partners" aria-label="Partners">
      <div class="tracker-eyebrow">MADE POSSIBLE BY</div>
      <div class="partner-logo-wall">
        <div class="partner-logo-item"><a href="https://www.arsenalaviation.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Arsenal Aviation"><img src="/assets/partners/arsenal-aviation-footer.svg" alt="Arsenal Aviation logo" width="849" height="624"></a></div>
        <div class="partner-logo-item"><a href="https://www.trilogyaviationgroup.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Trilogy Aviation Group"><img src="/assets/partners/trilogy-aviation-footer.svg" alt="Trilogy Aviation Group logo" width="367" height="76"></a></div>
        <div class="partner-logo-item"><a href="https://titanflights.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Titan Aviation Group"><img src="/assets/partners/titan-aviation-footer.png" alt="Titan Aviation Group logo" width="375" height="111"></a></div>
        <div class="partner-logo-item"><a href="https://fly1200.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit FLY1200"><img src="/assets/partners/fly1200-footer.svg" alt="FLY1200 logo" width="2769" height="1112"></a></div>
        <div class="partner-logo-item"><a href="https://www.flyexclusive.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit flyExclusive"><img src="/assets/partners/flyexclusive-footer.svg" alt="flyExclusive logo" width="582" height="108"></a></div>
        <div class="partner-logo-item"><a href="https://jetlinx.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Jet Linx"><img src="/assets/partners/jet-linx-footer.svg" alt="Jet Linx logo" width="250" height="158"></a></div>
        <div class="partner-logo-item"><a href="https://skywardaviation.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Skyward Aviation"><img src="/assets/partners/skyward-aviation-footer.svg" alt="Skyward Aviation logo" width="1443" height="1012"></a></div>
        <div class="partner-logo-item"><a href="https://flytrueskies.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit TrueSkies Aviation Group"><img src="/assets/partners/trueskies-footer.svg" alt="TrueSkies Aviation Group logo" width="1697" height="543"></a></div>
        <div class="partner-logo-item"><a href="https://magellanjets.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Magellan Jets"><img src="/assets/partners/magellan-jets-footer.svg" alt="Magellan Jets logo" width="265" height="25"></a></div>
        <div class="partner-logo-item"><a href="https://www.charterflightsupport.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Charter Flight Support"><img src="/assets/partners/charter-flight-support-footer.svg" alt="Charter Flight Support logo" width="250" height="100"></a></div>
        <div class="partner-logo-item"><a href="https://www.spyrollstudios.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Spyroll Studios"><img src="/assets/partners/spyroll-studios-footer.svg" alt="Spyroll Studios logo" width="692" height="104"></a></div>
        <div class="partner-logo-item"><a href="https://davidprotein.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit David"><img src="/assets/partners/david-footer.png" alt="David logo" width="905" height="386"></a></div>
        <div class="partner-logo-item"><a href="https://humantra.co.uk/" target="_blank" rel="noopener noreferrer" aria-label="Visit Humantra"><img src="/assets/partners/humantra-footer.png" alt="Humantra logo" width="1501" height="273"></a></div>
        <div class="partner-logo-item"><a href="https://rizkia.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Rizkia"><img src="/assets/partners/rizkia-footer.png" alt="Rizkia logo" width="1493" height="369"></a></div>
        <div class="partner-logo-item"><a href="https://www.whoop.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit WHOOP"><img src="/assets/partners/whoop-footer.png" alt="WHOOP logo" width="1501" height="255"></a></div>
      </div>
      <p class="global-site-footer-partner-disclaimer">All trademarks and logos are the property of their respective owners and are used with permission where applicable.</p>
    </div>
    <nav class="global-site-footer-legal" aria-label="Legal links">
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/participation-terms/">Participation Terms</a>
      <a href="/accessibility/">Accessibility</a>
    </nav>
    <p class="global-site-footer-disclaimer">Goodwin Generated Mission America is an endurance event and world record attempt. Routes, schedules, locations, tracking data and event details are subject to change. World record status is subject to independent verification. Participation in any associated run or event is voluntary and subject to the Participation Terms.</p>
    <div class="global-site-footer-bottom">
      <span>© 2026 Goodwin Company</span>
      <span>Goodwin Generated</span>
    </div>
  </footer>`;

const sharedHeaderHtml = `
  <nav class="tracker-nav" aria-label="Site navigation">
    <a class="tracker-mark" href="/" aria-label="GOODWIN ENDURANCE"><img src="/assets/goodwin-logo.png" alt="GOODWIN" width="2000" height="304"><span>Endurance</span></a>
    <button class="tracker-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="tracker-navlinks"><span></span></button>
    <div class="tracker-navlinks" id="tracker-navlinks">
      <a href="/#the-run">The Run</a>
      <a href="/#map">50 States</a>
      <a href="/updates/">News</a>
      <a href="/will/">Will</a>
      <a class="tracker-cta" href="/#rsvp">Join the Run</a>
    </div>
  </nav>`;

function addSharedFooter(html) {
  if (html.includes('class="site-footer"') || html.includes('class="global-site-footer"')) return html;
  let out = html.includes("</style>")
    ? html.replace("</style>", `${sharedFooterCss}\n  </style>`)
    : html.replace("</head>", `<style>${sharedFooterCss}</style></head>`);
  return out.replace("</body>", `${sharedFooterHtml}\n</body>`);
}

function localize(html, pageName) {
  let out = html;
  const offlineFontStylesheet = pageName === "live-tracking.html" ? "fonts/inter.css" : "fonts/offline-fonts.css";

  out = out
    .replace(/<script defer src="\/~flock\.js"[^>]*><\/script>/g, "")
    .replace(/<script defer src="\/__l5e\/events\.js"[^>]*><\/script>/g, "")
    .replace(/<script type="module" async="">import\("\/assets\/index-CK5luKon\.js"\)<\/script>/g, "")
    .replace(/<link rel="modulepreload"[^>]*>/g, "")
    .replace(/<link rel="stylesheet" href="\/assets\/styles-ulvf0Dcj\.css"/, `<link rel="stylesheet" href="${offlineFontStylesheet}"/><link rel="stylesheet" href="/assets/styles-ulvf0Dcj.css"`)
    .replace(/https:\/\/mission-america-journey\.lovable\.app\/partners/g, "partners.html")
    .replace(/https:\/\/pub-bb2e103a32db4e198524a2e9ed8f35b4\.r2\.dev\/[^"]+id-preview[^"]+\.png/g, "/assets/hero-runner-Ci5y42DW.jpg")
    .replace(/(href|src)="(?:\.\.\/)?assets\//g, '$1="/assets/')
    .replace(/(href|src)="(?:\.\.\/)?fonts\//g, '$1="/fonts/')
    .replace(/url\((["']?)(?:\.\.\/)?assets\//g, "url($1/assets/")
    .replace(/url\((["']?)(?:\.\.\/)?fonts\//g, "url($1/fonts/")
    .replace(/content="\/athletes"/g, 'content="/athletes/"')
    .replace(/content="\/partners"/g, 'content="/partners/"');

  if (pageName !== "live-tracking.html") {
    out = out.replace(
      "</head>",
      '<link rel="stylesheet" href="/assets/ambient-pages.css"><script defer src="/assets/ambient-pages.js"></script></head>',
    );
  }

  if (pageName === "athletes.html" || pageName === "partners.html") {
    out = out
      .replace(/<header class="fixed[\s\S]*?<\/header>/, sharedHeaderHtml)
      .replace(/<footer class="border-t[\s\S]*?<\/footer>/, "");
  }

  for (const id of videoIds) {
    out = out.replace(
      new RegExp(`https://i\\.ytimg\\.com/vi/${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/hqdefault\\.jpg`, "g"),
      `/assets/youtube/${id}.jpg`,
    );
  }

  if (pageName === "partners.html") {
    out = out.replace(
      '<form class="mt-10 grid gap-4">',
      '<form class="mt-10 grid gap-4" data-offline-partner-form>',
    );
    out = out.replace(
      "</body>",
      `<script>
document.querySelector("[data-offline-partner-form]")?.addEventListener("submit", function (event) {
  event.preventDefault();
  this.outerHTML = '<div class="mt-10 p-8 border border-mint rounded-sm bg-background"><div class="font-display text-2xl text-mint">Received.</div><p class="mt-2 text-foreground/80">Thanks — a member of the Goodwin partnerships team will be in touch shortly.</p></div>';
});
</script></body>`,
    );
  }

  if (
    pageName === "updates.html" ||
    pageName === "faq.html" ||
    pageName === "privacy.html" ||
    pageName === "terms.html" ||
    pageName === "participation-terms.html" ||
    pageName === "accessibility.html"
  ) {
    out = out.replace('<base href="index.html">', '<base href="/">');
    out = out.replace(/(href|src)="assets\/partners\//g, '$1="/assets/partners/');
  }

  return addSharedFooter(out);
}

function patchClientBundle() {
  const homeBundle = join(dist, "assets", "index-BE9Jl0ji.js");
  let js = readFileSync(homeBundle, "utf8");

  js = js.replace(
    'src:M,alt:"William Goodge running at sunset",width:1920,height:1080,className:"absolute inset-0 w-full h-full object-cover object-[center_25%] sm:object-center"',
    'src:M,alt:"William Goodge running at sunset",width:1920,height:1080,style:{objectPosition:"center center",transform:"translateY(44px) scale(1.1)",transformOrigin:"center center"},className:"absolute inset-0 w-full h-full object-cover object-[center_25%] sm:object-center"',
  );

  js = js.replace(
    'className:"font-display text-[clamp(3rem,9vw,7.5rem)] font-medium leading-[0.92] text-white whitespace-nowrap",children:',
    'className:"font-display text-[clamp(3rem,9vw,7.5rem)] font-medium leading-[0.92] text-white whitespace-nowrap",style:{fontSize:"clamp(3rem,10vw,8.75rem)"},children:',
  );

  js = js.replace(
    'src:`https://i.ytimg.com/vi/${t.id}/hqdefault.jpg`',
    'src:`/assets/youtube/${t.id}.jpg`',
  );

  js = js.replace(
    'href:"https://mission-america-journey.lovable.app/partners"',
    'href:"/partners"',
  );

  writeFileSync(homeBundle, js);
}

for (const [source, target] of pages) {
  const html = readFileSync(join(root, source), "utf8");
  const destination = join(dist, target);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, localize(html, target));
}

writeFileSync(join(dist, "index.html"), readFileSync(join(dist, "live-tracking.html"), "utf8"));

patchClientBundle();

function writeDirectoryIndex(pageName, directoryName) {
  let html = readFileSync(join(dist, pageName), "utf8");
  html = html
    .replace(/(href|src)="assets\//g, '$1="../assets/')
    .replace(/(href|src)="fonts\//g, '$1="../fonts/')
    .replace(/url\((["']?)assets\//g, "url($1../assets/")
    .replace(/url\((["']?)fonts\//g, "url($1../fonts/");
  writeFileSync(join(dist, directoryName, "index.html"), html);
}

mkdirSync(join(dist, "athletes"), { recursive: true });
mkdirSync(join(dist, "partners"), { recursive: true });
mkdirSync(join(dist, "live-tracking"), { recursive: true });
mkdirSync(join(dist, "the-run"), { recursive: true });
mkdirSync(join(dist, "will"), { recursive: true });
mkdirSync(join(dist, "fifty-runs"), { recursive: true });
mkdirSync(join(dist, "updates"), { recursive: true });
mkdirSync(join(dist, "faq"), { recursive: true });
mkdirSync(join(dist, "week-1"), { recursive: true });
mkdirSync(join(dist, "week-2"), { recursive: true });
mkdirSync(join(dist, "week-3"), { recursive: true });
mkdirSync(join(dist, "privacy"), { recursive: true });
mkdirSync(join(dist, "terms"), { recursive: true });
mkdirSync(join(dist, "participation-terms"), { recursive: true });
mkdirSync(join(dist, "accessibility"), { recursive: true });
writeDirectoryIndex("athletes.html", "athletes");
writeDirectoryIndex("partners.html", "partners");
writeDirectoryIndex("live-tracking.html", "live-tracking");
writeDirectoryIndex("the-run.html", "the-run");
writeDirectoryIndex("will.html", "will");
writeDirectoryIndex("fifty-runs.html", "fifty-runs");
writeDirectoryIndex("updates.html", "updates");
writeDirectoryIndex("faq.html", "faq");
writeDirectoryIndex("week-1.html", "week-1");
writeDirectoryIndex("week-2.html", "week-2");
writeDirectoryIndex("week-3.html", "week-3");
writeDirectoryIndex("privacy.html", "privacy");
writeDirectoryIndex("terms.html", "terms");
writeDirectoryIndex("participation-terms.html", "participation-terms");
writeDirectoryIndex("accessibility.html", "accessibility");

writeFileSync(
  join(dist, "README.txt"),
  [
    "Goodwin Generated Mission America offline website export",
    "",
    "Open index.html in a browser to view the site.",
    "For the interactive map and route navigation, serve this folder from a local web server.",
    "Keep the assets folder next to the HTML files.",
    "Keep the fonts folder next to the HTML files.",
    "The visible site assets are bundled locally for offline review.",
    "The display and body fonts are bundled locally for consistent typography.",
    "The sponsor live tracker page is available at live-tracking.html.",
    "The Instagram feed expects a server endpoint at /api/instagram-feed with INSTAGRAM_ACCESS_TOKEN set server-side.",
    "External video and teamGoodwin.com links still point to their original websites when internet is available.",
    "",
  ].join("\n"),
);

mkdirSync(join(dist, "server"), { recursive: true });

const deployInstagramFeed = [
  "assets/instagram/williamgoodge-01.jpg",
  "assets/instagram/williamgoodge-02.jpg",
  "assets/instagram/williamgoodge-03.jpg",
  "assets/instagram/williamgoodge-04.jpg",
  "assets/hero-runner-Ci5y42DW.jpg",
  "assets/road-aerial-DbGvJBXy.jpg",
  "assets/shoes-Ds0VB7pt.jpg",
  "assets/goodge-portrait-BKrZBh3V.jpg",
].map((mediaUrl, index) => ({
  id: `fallback-${index + 1}`,
  permalink: "https://www.instagram.com/williamgoodge?igsi=amphOWpyaXdubzE=",
  mediaUrl: `/${mediaUrl}`,
  caption: "Recent William Goodge Instagram image",
  timestamp: null,
}));

const liveTrackingPartnerAssetPaths = [
  "assets/partners/arsenal-aviation-footer.svg",
  "assets/partners/trilogy-aviation-footer.svg",
  "assets/partners/titan-aviation-footer.png",
  "assets/partners/fly1200-footer.svg",
  "assets/partners/flyexclusive-footer.svg",
  "assets/partners/jet-linx-footer.svg",
  "assets/partners/skyward-aviation-footer.svg",
  "assets/partners/trueskies-footer.svg",
  "assets/partners/magellan-jets-footer.svg",
  "assets/partners/charter-flight-support-footer.svg",
  "assets/partners/spyroll-studios-footer.svg",
  "assets/partners/david-footer.png",
  "assets/partners/humantra-footer.png",
  "assets/partners/rizkia-footer.png",
  "assets/partners/whoop-footer.png",
];

const deployAssetPaths = [
  "assets/styles-ulvf0Dcj.css",
  "assets/index-CIGW-MKW.css",
  "assets/tracker-base.css",
  "assets/ambient-scroll.css",
  "assets/us-states-albers-10m.json",
  "assets/tracker-base.js",
  "assets/ambient-scroll.js",
  "assets/ticker-updates.json",
  "assets/goodwin-favicon.png",
  "assets/goodwin-webclip.png",
  "assets/goodwin-logo.png",
  "assets/mission-america-logo.png",
  "assets/mission-america-logo-mobile.png",
  "assets/map-runner-bobblehead-small.png",
  "assets/map-rv-green-small.png",
  "assets/intro-dubai-skyline-running.jpg",
  "assets/intro-group-running.jpg",
  "assets/intro-close-portrait.jpg",
  "assets/intro-fence-stretch.jpg",
  "assets/intro-solo-track-running.jpg",
  "assets/hero-runner-Ci5y42DW.jpg",
  "assets/hero-signal-2026-08-30-232350.mp4",
  "assets/road-aerial-DbGvJBXy.jpg",
  "assets/goodge-portrait-BKrZBh3V.jpg",
  "assets/overview-the-run.jpeg",
  "assets/athlete-will.jpeg",
  "assets/world-record-50-states.jpeg",
  "assets/field-notes-week-1-launch.jpg",
  "assets/field-notes-week-2-grind.jpg",
  "assets/field-notes-week-3-finish.jpg",
  "fonts/inter.css",
  "fonts/inter-400-subset.woff2",
  "fonts/inter-500-subset.woff2",
  "fonts/inter-600-subset.woff2",
  "fonts/inter-700-subset.woff2",
  "assets/instagram/williamgoodge-01.jpg",
  "assets/instagram/williamgoodge-02.jpg",
  "assets/instagram/williamgoodge-03.jpg",
  "assets/instagram/williamgoodge-04.jpg",
  ...liveTrackingPartnerAssetPaths,
];

function contentType(pathname) {
  if (pathname.endsWith(".css")) return "text/css; charset=utf-8";
  if (pathname.endsWith(".js") || pathname.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (pathname.endsWith(".json")) return "application/json; charset=utf-8";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".woff2")) return "font/woff2";
  if (pathname.endsWith(".mp4")) return "video/mp4";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

const deployAssets = Object.fromEntries(
  deployAssetPaths.map((path) => [
    path,
    {
      contentType: contentType(path),
      body: readFileSync(join(dist, path)).toString("base64"),
    },
  ]),
);

const trackingCoreSource = readFileSync(join(root, "api", "flight-tracking-core.mjs"), "utf8")
  .replace(/\bexport\s+/g, "");

writeFileSync(
  join(dist, "server", "index.js"),
  `const pages = ${JSON.stringify(Object.fromEntries([
    ["index.html", readFileSync(join(dist, "live-tracking.html"), "utf8")],
    ["live-tracking.html", readFileSync(join(dist, "live-tracking.html"), "utf8")],
    ["live-tracking/index.html", readFileSync(join(dist, "live-tracking.html"), "utf8")],
    ["the-run.html", readFileSync(join(dist, "the-run.html"), "utf8")],
    ["the-run/index.html", readFileSync(join(dist, "the-run.html"), "utf8")],
    ["will.html", readFileSync(join(dist, "will.html"), "utf8")],
    ["will/index.html", readFileSync(join(dist, "will.html"), "utf8")],
    ["fifty-runs.html", readFileSync(join(dist, "fifty-runs.html"), "utf8")],
    ["fifty-runs/index.html", readFileSync(join(dist, "fifty-runs.html"), "utf8")],
    ["updates.html", readFileSync(join(dist, "updates.html"), "utf8")],
    ["updates/index.html", readFileSync(join(dist, "updates.html"), "utf8")],
    ["faq.html", readFileSync(join(dist, "faq.html"), "utf8")],
    ["faq/index.html", readFileSync(join(dist, "faq.html"), "utf8")],
    ["week-1.html", readFileSync(join(dist, "week-1.html"), "utf8")],
    ["week-1/index.html", readFileSync(join(dist, "week-1.html"), "utf8")],
    ["week-2.html", readFileSync(join(dist, "week-2.html"), "utf8")],
    ["week-2/index.html", readFileSync(join(dist, "week-2.html"), "utf8")],
    ["week-3.html", readFileSync(join(dist, "week-3.html"), "utf8")],
    ["week-3/index.html", readFileSync(join(dist, "week-3.html"), "utf8")],
    ["privacy.html", readFileSync(join(dist, "privacy.html"), "utf8")],
    ["privacy/index.html", readFileSync(join(dist, "privacy.html"), "utf8")],
    ["terms.html", readFileSync(join(dist, "terms.html"), "utf8")],
    ["terms/index.html", readFileSync(join(dist, "terms.html"), "utf8")],
    ["participation-terms.html", readFileSync(join(dist, "participation-terms.html"), "utf8")],
    ["participation-terms/index.html", readFileSync(join(dist, "participation-terms.html"), "utf8")],
    ["accessibility.html", readFileSync(join(dist, "accessibility.html"), "utf8")],
    ["accessibility/index.html", readFileSync(join(dist, "accessibility.html"), "utf8")],
  ]))};
const assets = ${JSON.stringify(deployAssets)};
const instagramFeed = ${JSON.stringify(deployInstagramFeed)};
${trackingCoreSource}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const clean = pathname.replace(/^\\/+/, "").replace(/\\/+$/, "");

    const page = pathname === "/" ? pages["index.html"] : pages[clean] || pages[clean + "/index.html"];
    if (page) {
      return new Response(page, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache"
        }
      });
    }

    if (clean === "api/instagram-feed") {
      return Response.json({ data: instagramFeed }, { headers: { "cache-control": "no-cache" } });
    }

    if (clean === "api/tracking-status") {
      const { searchParams } = new URL(request.url);
      const pinnedProgress = Number(searchParams.get("progress"));
      return Response.json({
        source: "mock",
        mode: "simulated",
        updatedAt: new Date().toISOString(),
        progress: Number.isFinite(pinnedProgress) ? Math.min(1, Math.max(0, pinnedProgress)) : 0,
        flightStatus: publicFlightStatus({
          now: searchParams.get("now") || new Date(),
          env
        })
      }, { headers: { "cache-control": "no-cache" } });
    }

    if (clean.startsWith("api/")) {
      return new Response("Not found", { status: 404 });
    }

    const asset = assets[clean];
    if (asset) {
      const bytes = Uint8Array.from(atob(asset.body), (char) => char.charCodeAt(0));
      return new Response(bytes, {
        headers: {
          "content-type": asset.contentType,
          "cache-control": clean.endsWith(".css") || clean.endsWith(".json") ? "no-cache" : "public, max-age=31536000, immutable"
        }
      });
    }

    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    return new Response("Not found", { status: 404 });
  }
};
`,
);
