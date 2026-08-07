// ===== PRODUCT FILTER MODULE (FIXED) =====
const ProductFilter = {
  currentFilter: 'all',

  init() {
    const pills = document.querySelectorAll('.pill');
    if (!pills.length) return; // tidak ada pill = bukan halaman filter

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentFilter = pill.dataset.filter;
        // Pengaman: pastikan loadProducts ada (dari main.js)
        if (typeof loadProducts === 'function') {
          loadProducts(this.currentFilter);
        } else {
          console.warn('ProductFilter: loadProducts() tidak ditemukan.');
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => ProductFilter.init());
