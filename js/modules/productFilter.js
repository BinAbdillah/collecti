// ===== PRODUCT FILTER MODULE =====
const ProductFilter = {
    currentFilter: 'all',
  
    init() {
      const pills = document.querySelectorAll('.pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.currentFilter = pill.dataset.filter;
          loadProducts(this.currentFilter);
        });
      });
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => ProductFilter.init());