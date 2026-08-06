// js/modules/iconLoader.js

const IconLoader = {
    // Peta: Emoji -> Nama Icon di JSON
    emojiMap: {
      '': 'gamis',
      '👫': 'kebaya',
      '👖': 'kulot',
      '🧕': 'khimar',
      '🔍': 'search',
      '♡': 'heart',
      '🛒': 'bag',
      '👤': 'user',
      '': 'menu',
      '🌙': 'moon',
      '✨': 'sparkles',
      '🎨': 'shuffle',
      '📐': 'ruler',
      '✕': 'x',
      '＋': 'plus'
    },
  
    icons: {},
  
    async init() {
      try {
        // Tentukan path JSON (otomatis menyesuaikan kedalaman folder)
        const isPage = window.location.pathname.includes('/pages/');
        const isRoot = !isPage;
        const jsonPath = isPage ? '../data/icons.json' : 'data/icons.json';
  
        const res = await fetch(jsonPath);
        this.icons = await res.json();
        this.replaceIcons();
      } catch (e) {
        console.warn('IconLoader: Gagal memuat icons.json, menggunakan emoji fallback.');
      }
    },
  
    replaceIcons() {
      // Cari semua elemen yang punya class 'icon-replace' (opsional)
      // Atau cari di container tertentu agar tidak berat
      const containers = document.querySelectorAll('.categories, .products-grid, .nav-actions, .feature-icon, .cat-circle');
      
      containers.forEach(container => {
        const html = container.innerHTML;
        let newHtml = html;
        
        // Ganti setiap emoji yang ada di map dengan SVG-nya
        for (const [emoji, iconName] of Object.entries(this.emojiMap)) {
          if (this.icons[iconName]) {
            // Tambahkan class 'modern-icon' ke SVG agar bisa di-style via CSS
            const svg = this.icons[iconName].replace('<svg', "<svg class='modern-icon'");
            newHtml = newHtml.split(emoji).join(svg);
          }
        }
        
        if (newHtml !== html) {
          container.innerHTML = newHtml;
        }
      });
    }
  };
  
  // Jalankan saat DOM siap
  document.addEventListener('DOMContentLoaded', () => IconLoader.init());