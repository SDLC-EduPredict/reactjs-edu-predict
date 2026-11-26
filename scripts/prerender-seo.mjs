import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://reactjs-edu-predict.onrender.com').replace(/\/$/, '');
const APP_NAME = 'EDU-PREDICT';

const NAV = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/courses', 'Courses'],
  ['/categories', 'Categories'],
  ['/faculty', 'Faculty'],
  ['/contact', 'Contact'],
];

const PAGES = [
  {
    path: '/',
    title: 'Edu Predict – Upgrade Your Skills & Build Your Career',
    description: 'Explore Edu-Predict for AI learning and professional IT courses. Learn Python, Django, Data Science, and Machine Learning from professionals.',
    h1: 'Master Engineering with Predictive AI Mentorship',
    text: 'Master in-demand tech skills with intelligent learning and predictive academic analytics.',
  },
  {
    path: '/about',
    title: `About EDU-PREDICT | ${APP_NAME}`,
    description: 'Edu-Predict bridges the gap between aspiration and industry-ready skills with predictive analytics and dedicated 1-on-1 mentorship.',
    h1: 'Empowering Careers Through AI and Technology',
    text: 'Bridging the gap between aspiration and industry-ready skills with predictive analytics and dedicated 1-on-1 mentorship.',
  },
  {
    path: '/courses',
    title: `Courses | ${APP_NAME}`,
    description: 'Professional IT courses in Python, Django, Full Stack, Data Science and Machine Learning with mentor-led tracks and AI-predicted progress.',
    h1: 'Explore Professional IT Courses to Build Your Future',
    text: 'Learn Python, Django, Full Stack, Data Science and Machine Learning with mentor-led tracks and AI-predicted progress at every step.',
  },
  {
    path: '/categories',
    title: `Course Categories | ${APP_NAME}`,
    description: 'Browse Edu-Predict course categories. Each discipline groups career-focused tracks designed with industry mentors.',
    h1: 'Browse by Category',
    text: 'Each discipline groups career-focused tracks designed with industry mentors.',
  },
  {
    path: '/faculty',
    title: `Faculty & Mentors | ${APP_NAME}`,
    description: 'Meet the Edu-Predict faculty: industry practitioners who teach, review and mentor, guided by live academic data.',
    h1: 'Meet Your Academic & Engineering Mentors',
    text: 'Industry practitioners who teach, review and mentor — guided by live academic data.',
  },
  {
    path: '/contact',
    title: `Contact Admissions | ${APP_NAME}`,
    description: 'Questions about courses, batches, fees or the AI prediction engine? Contact the Edu-Predict admissions team and mentors.',
    h1: 'Plan Your Future In Education With Edu-predict',
    text: 'Questions about courses, batches, fees or our AI prediction engine? Our admissions team and mentors are here to help you choose the right path.',
  },
];

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const shell = (page) => `<div class="seo-shell">
      <nav aria-label="Main">${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</nav>
      <main>
        <h1>${escape(page.h1)}</h1>
        <p>${escape(page.text)}</p>
      </main>
    </div>`;

const SHELL_STYLE = `<style>
      .spa-route .seo-shell{display:none}
      .seo-shell{min-height:100vh;display:flex;flex-direction:column;align-items:center;font-family:Mulish,system-ui,sans-serif;color:#0f172a;background:#f8f8fc}
      .seo-shell nav{display:flex;gap:28px;padding:22px 16px;font-size:15px}
      .seo-shell nav a{color:#334155;text-decoration:none}
      .seo-shell main{max-width:760px;padding:12vh 24px 0;text-align:center}
      .seo-shell h1{font-family:'Roboto Slab',Georgia,serif;font-size:clamp(2rem,5vw,3.4rem);line-height:1.15;margin:0}
      .seo-shell p{margin-top:20px;color:#64748b;font-size:17px;line-height:1.6}
    </style>`;

const routeGuard = (page) =>
  `<script>if ((location.pathname.replace(/\\/+$/, '') || '/') !== '${page.path}') document.documentElement.classList.add('spa-route');</script>`;

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender-seo: <div id="root"></div> not found in dist/index.html');
}

const render = (page) =>
  template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escape(page.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${SITE_URL}${page.path === '/' ? '/' : page.path}" />`)
    .replace('</head>', `    ${SHELL_STYLE}\n    ${routeGuard(page)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">\n    ${shell(page)}\n    </div>`);

for (const page of PAGES) {
  const html = render(page);
  if (page.path === '/') {
    writeFileSync(join(DIST, 'index.html'), html);
  } else {
    const name = page.path.slice(1);
    mkdirSync(join(DIST, name), { recursive: true });
    writeFileSync(join(DIST, name, 'index.html'), html);
    writeFileSync(join(DIST, `${name}.html`), html);
  }
  console.log(`prerender-seo: ${page.path} -> <h1>${page.h1}</h1>`);
}
