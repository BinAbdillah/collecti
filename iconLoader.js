// js/modules/iconLoader.js
const IconLoader = {
  // Unicode escape: aman dari masalah encoding / copy-paste
  emojiMap: {
    '\u{1F9D7}\u200D\u2640\uFE0F': 'khimar',   // 🧗‍♀️ (hero)
    '\u{1F457}': 'gamis',                      // 👗
    '\u{1F46B}': 'kebaya',                     // 👫
    '\u{1F456}': 'kulot',                      // 👖
    '\u{1F9D5}': 'khimar',                     // 🧕
    '\u{1F50D}': 'search',                     // 🔍
    '\u2661':    'heart',                      // ♡
    '\u{1F6D2}': 'bag',                        // 🛒
    '\u{1F6CD}': 'bag',                        // 🛍️
    '\u{1F464}': 'user',                       // 👤
    '\u2630':    'menu',                       // ☰
    '\u{1F319}': 'moon',                       // 🌙
    '\u2728':    'sparkles',                   // ✨
    '\u{1F31F}': 'sparkles',                   // 🌟
    '\u{1F3A8}': 'shuffle',                    // 🎨
    '\u{1F4D0}': 'ruler',                      // 📐
    '\u{1F4CF}': 'ruler',                      // 📏
    '\u{1F483}': 'sparkles'                    // 💃
  },

  icons: {},

  async init() {
    try {
      const isPage = window.location.pathname.includes('/pages/');
      const jsonPath = isPage ? '../data/icons.json' : 'data/icons.json';
      const res = await fetch(jsonPath);
      if (!res.ok) throw new Error('icons.json not found');
      this.icons = await res.json();
      this.replaceIcons();
    } catch (e) {
      console.warn('IconLoader: icons.json gagal dimuat, emoji tetap tampil.', e);
    }
  },

  replaceIcons() {
    const selectors = '.categories, .products-grid, .nav-actions, .feature-card, .hero-img-placeholder, .festive-visual, .custom-request, .hero-text, .announcement';
    document.querySelectorAll(selectors).forEach(container => {
      let html = container.innerHTML;
      let changed = false;

      for (const [emoji, iconName] of Object.entries(this.emojiMap)) {
        // PENGAMAN: lewati key kosong agar tidak merusak halaman
        if (!emoji || !this.icons[iconName]) continue;

        if (html.includes(emoji)) {
          const svg = this.icons[iconName].replace('<svg', "<svg class='modern-icon'");
          html = html.split(emoji).join(svg);
          changed = true;
        }
      }
      if (changed) container.innerHTML = html;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => IconLoader.init());