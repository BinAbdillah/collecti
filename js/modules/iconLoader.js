// js/modules/iconLoader.js - FINAL
const IconLoader = {
  emojiMap: {
    '\u{1F9D7}\u200D\u2640\uFE0F': 'khimar',
    '\u{1F457}': 'gamis',
    '\u{1F46B}': 'kebaya',
    '\u{1F456}': 'kulot',
    '\u{1F9D5}': 'khimar',
    '\u{1F50D}': 'search',
    '\u2661': 'heart',
    '\u{1F6D2}': 'bag',
    '\u{1F6CD}': 'bag',
    '\u{1F464}': 'user',
    '\u2630': 'menu',
    '\u{1F319}': 'moon',
    '\u2728': 'sparkles',
    '\u{1F31F}': 'sparkles',
    '\u{1F3A8}': 'shuffle',
    '\u{1F4D0}': 'ruler',
    '\u{1F4CF}': 'ruler',
    '\u{1F483}': 'sparkles'
  },
  icons: {},

  async init() {
    try {
      const isPage = window.location.pathname.includes('/pages/');
      const jsonPath = isPage ? '../data/icons.json' : 'data/icons.json';
      const res = await fetch(jsonPath);
      if (!res.ok) throw new Error('icons.json not found');
      this.icons = await res.json();
      this.injectSprite();
      this.replaceIcons();
    } catch (e) {
      console.warn('IconLoader: gagal muat icons.json, emoji tetap tampil.', e);
    }
  },

  injectSprite() {
    if (document.getElementById('pueny-sprite')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'pueny-sprite';
    svg.style.display = 'none';
    let inner = '';
    for (const [key, str] of Object.entries(this.icons)) {
      inner += str.replace('<svg', '<symbol id="i-' + key + '"').replace('</svg>', '</symbol>');
    }
    svg.innerHTML = inner;
    document.body.prepend(svg);
  },

  replaceIcons() {
    const selectors = '.categories, .products-grid, .nav-actions, .feature-card, .hero-img-placeholder, .festive-visual, .custom-request, .hero-text, .announcement';
    document.querySelectorAll(selectors).forEach(c => {
      let html = c.innerHTML, changed = false;
      for (const [emoji, name] of Object.entries(this.emojiMap)) {
        if (!emoji || !this.icons[name]) continue;
        if (html.includes(emoji)) {
          html = html.split(emoji).join("<svg class='modern-icon'><use href='#i-" + name + "'></use></svg>");
          changed = true;
        }
      }
      if (changed) c.innerHTML = html;
    });
  }
};
document.addEventListener('DOMContentLoaded', () => IconLoader.init());
