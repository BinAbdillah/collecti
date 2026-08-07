// js/modules/iconLoader.js
const IconLoader = {
  emojiMap: {
    '👗': 'gamis',
    '👫': 'kebaya',
    '👖': 'kulot',
    '': 'khimar',
    '': 'search',
    '♡': 'heart',
    '🛒': 'bag',
    '👤': 'user',
    '☰': 'menu',
    '🌙': 'moon',
    '✨': 'sparkles',
    '🎨': 'shuffle',
    '📐': 'ruler'
  },
  icons: {},

  async init() {
    try {
      const isPage = window.location.pathname.includes('/pages/');
      const jsonPath = isPage ? '../data/icons.json' : 'data/icons.json';
      
      const res = await fetch(jsonPath);
      if (!res.ok) throw new Error('Icons JSON not found');
      this.icons = await res.json();
      this.replaceIcons();
    } catch (e) {
      console.warn('IconLoader: Using emoji fallback', e);
    }
  },

  replaceIcons() {
    const selectors = '.categories, .products-grid, .nav-actions, .feature-card, .hero-img-placeholder, .festive-visual, .custom-request, .feature-icon';
    const containers = document.querySelectorAll(selectors);
    
    containers.forEach(container => {
      let html = container.innerHTML;
      let changed = false;
      
      for (const [emoji, iconName] of Object.entries(this.emojiMap)) {
        if (this.icons[iconName]) {
          const svg = this.icons[iconName].replace('<svg', "<svg class='modern-icon'");
          if (html.includes(emoji)) {
            html = html.split(emoji).join(svg);
            changed = true;
          }
        }
      }
      if (changed) container.innerHTML = html;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => IconLoader.init());