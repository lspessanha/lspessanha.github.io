import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import * as cheerio from 'cheerio';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://leonardosiqueira.dev.br';
const today = new Date().toISOString().slice(0, 10);

const LINKS = {
  linkedin: 'https://www.linkedin.com/in/leonardo-siqueira-pessanha',
  github: 'https://github.com/lspessanha',
};

const KNOWS_ABOUT = [
  'TypeScript', 'Node.js', 'NestJS', 'React', 'Next.js', 'PostgreSQL', 'Apache Kafka',
  'Keycloak', 'Kubernetes', 'AWS', 'Google Cloud', 'GitLab CI', 'Software Architecture',
  'Microservices', 'Micro-frontends', 'WCAG', 'Digital Government', 'Product Management',
];

const LOCALES = {
  pt: {
    path: '/', htmlLang: 'pt-BR', ogLocale: 'pt_BR', name: 'Português',
    title: 'Leonardo Siqueira · Tech Lead e Especialista de Produto',
    description: 'Tech Lead, Especialista de Produto e Desenvolvedor Full Stack Sênior em São Paulo. Mais de 15 anos com TypeScript, Node.js, NestJS e React em plataformas de governo digital.',
    jobTitle: 'Especialista de Produto e Tech Lead',
    ui: { nav: 'Menu principal', theme: 'Tema escuro', print: 'Imprimir ou salvar em PDF', menu: 'Menu', lang: 'Idioma', cv: 'Currículo - Leonardo Siqueira Pessanha' },
  },
  en: {
    path: '/en/', htmlLang: 'en', ogLocale: 'en_US', name: 'English',
    title: 'Leonardo Siqueira · Tech Lead & Product Specialist',
    description: 'Tech Lead, Product Specialist and Senior Full Stack Developer based in São Paulo, Brazil. 15+ years building digital-government platforms with TypeScript, Node.js, NestJS and React.',
    jobTitle: 'Product Specialist & Tech Lead',
    ui: { nav: 'Main menu', theme: 'Dark theme', print: 'Print or save as PDF', menu: 'Menu', lang: 'Language', cv: 'Resume - Leonardo Siqueira Pessanha' },
  },
  es: {
    path: '/es/', htmlLang: 'es', ogLocale: 'es_ES', name: 'Español',
    title: 'Leonardo Siqueira · Tech Lead y Especialista de Producto',
    description: 'Tech Lead, Especialista de Producto y Desarrollador Full Stack Senior en São Paulo, Brasil. Más de 15 años con TypeScript, Node.js, NestJS y React en plataformas de gobierno digital.',
    jobTitle: 'Especialista de Producto y Tech Lead',
    ui: { nav: 'Menú principal', theme: 'Tema oscuro', print: 'Imprimir o guardar en PDF', menu: 'Menú', lang: 'Idioma', cv: 'Currículum - Leonardo Siqueira Pessanha' },
  },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function head(code) {
  const l = LOCALES[code];
  const url = BASE + l.path;
  // Hash do arquivo na URL: LinkedIn e afins guardam a imagem pelo endereço, então ela muda quando a imagem muda
  const ogHash = createHash('sha1').update(readFileSync(join(ROOT, 'og', `${code}.png`))).digest('hex').slice(0, 8);
  const image = `${BASE}/og/${code}.png?v=${ogHash}`;
  const alternates = Object.entries(LOCALES)
    .map(([, o]) => `<link rel="alternate" hreflang="${o.htmlLang}" href="${BASE + o.path}" />`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${BASE}/" />`);
  const ogAlternates = Object.entries(LOCALES)
    .filter(([c]) => c !== code)
    .map(([, o]) => `<meta property="og:locale:alternate" content="${o.ogLocale}" />`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${BASE}/#website`, url: `${BASE}/`, name: 'Leonardo Siqueira', inLanguage: Object.values(LOCALES).map((o) => o.htmlLang) },
      {
        '@type': 'ProfilePage', '@id': `${url}#profilepage`, url, name: l.title, description: l.description,
        inLanguage: l.htmlLang, isPartOf: { '@id': `${BASE}/#website` }, dateModified: today,
        primaryImageOfPage: image, mainEntity: { '@id': `${BASE}/#person` },
      },
      {
        '@type': 'Person', '@id': `${BASE}/#person`, name: 'Leonardo Siqueira Pessanha', alternateName: 'Leonardo Siqueira',
        url: `${BASE}/`, jobTitle: l.jobTitle,
        worksFor: { '@type': 'Organization', name: 'X-VIA Governo Digital' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidade São Judas Tadeu' },
        address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR' },
        knowsLanguage: ['pt-BR', 'en'], knowsAbout: KNOWS_ABOUT, sameAs: Object.values(LINKS),
      },
    ],
  };

  return [
    `<title>${esc(l.title)}</title>`,
    `<meta name="description" content="${esc(l.description)}" />`,
    `<meta name="author" content="Leonardo Siqueira Pessanha" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:site_name" content="Leonardo Siqueira" />`,
    `<meta property="og:title" content="${esc(l.title)}" />`,
    `<meta property="og:description" content="${esc(l.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(l.title)}" />`,
    `<meta property="og:locale" content="${l.ogLocale}" />`,
    ...ogAlternates,
    `<meta property="profile:first_name" content="Leonardo" />`,
    `<meta property="profile:last_name" content="Siqueira Pessanha" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(l.title)}" />`,
    `<meta name="twitter:description" content="${esc(l.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].join('\n');
}

function langSwitch(code) {
  const l = LOCALES[code];
  const links = Object.entries(LOCALES)
    .filter(([c]) => c !== code)
    .map(([c, o]) => `<a class="util" href="${o.path}" hreflang="${o.htmlLang}" lang="${o.htmlLang}" aria-label="${c.toUpperCase()}, ${o.name}" title="${o.name}">${c.toUpperCase()}</a>`)
    .join('');
  return `<div class="lang-switch" role="group" aria-label="${l.ui.lang}">${links}</div>`;
}

const template = readFileSync(join(ROOT, 'src/index.html'), 'utf8');

for (const code of Object.keys(LOCALES)) {
  const l = LOCALES[code];
  const html = template.replace(/\{\{ui\.(\w+)\}\}/g, (_, k) => esc(l.ui[k]));
  const $ = cheerio.load(html);

  // Mantém só o idioma da página; os demais viram URLs próprias com hreflang
  $('body [lang]').each((_, el) => {
    const $el = $(el);
    if ($el.attr('lang') === code) $el.removeAttr('lang');
    else $el.remove();
  });

  $('html').attr('lang', l.htmlLang);
  $('head').contents().filter((_, n) => n.type === 'comment' && n.data.includes('@head')).replaceWith(head(code));
  $('nav .utils').contents().filter((_, n) => n.type === 'comment' && n.data.includes('@lang-switch')).replaceWith(langSwitch(code));

  const out = join(ROOT, l.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, $.html());
  console.log('gerado', out.replace(ROOT, '.'));
}

const urls = Object.values(LOCALES).map((l) => {
  const alt = Object.values(LOCALES)
    .map((o) => `    <xhtml:link rel="alternate" hreflang="${o.htmlLang}" href="${BASE + o.path}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/"/>`)
    .join('\n');
  return `  <url>\n    <loc>${BASE + l.path}</loc>\n    <lastmod>${today}</lastmod>\n${alt}\n  </url>`;
});
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
console.log('gerado ./sitemap.xml e ./robots.txt');
