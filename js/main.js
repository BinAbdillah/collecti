// ===== PUENY COLLECTIONS - MAIN JS =====

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    loadTestimonials();
    initNavbar();
    initSearch();
  });
  
  // ===== LOAD DATA FROM JSON =====
  async function fetchJSON(path) {
    try {
      const res = await fetch(path);
      return await res.json();
    } catch (e) {
      console.warn('Gagal load:', path, e);
      return null;
    }
  }
  
  // ===== RENDER CATEGORIES =====
  async function loadCategories() {
    const data = await fetchJSON('data/categories.json');
    if (!data) return;
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    grid.innerHTML = data.categories.map(cat => `
      <div class="cat-item" onclick="filterByCategory('${cat.id}')">
        <div class="cat-circle">${cat.icon}</div>
        <div class="cat-name">${cat.name}</div>
        <div class="cat-count">${cat.count > 0 ? cat.count + ' produk' : 'Coming soon'}</div>
      </div>
    `).join('');
  }
  
  // ===== RENDER PRODUCTS =====
  async function loadProducts(filter = 'all') {
    const data = await fetchJSON('data/products.json');
    if (!data) return;
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
  
    let items = data.products;
    if (filter !== 'all') {
      items = items.filter(p => p.category === filter);
    }
  
    grid.innerHTML = items.map(p => `
      <div class="product-card" data-category="${p.category}">
      <div class="product-img">
      ${p.image ? `<img src="${p.image}" alt="${p.name}">` : getCategoryIcon(p.category)}
      ${p.badge ? `<span class="product-badge ${p.badge}">${getBadgeText(p.badge)}</span>` : ''}
    </div>
        <div class="product-info">
          <h4>${p.name}</h4>
          <div class="product-price">
            Rp ${p.price.toLocaleString('id-ID')}
            ${p.oldPrice ? `<span class="old">Rp ${p.oldPrice.toLocaleString('id-ID')}</span>` : ''}
          </div>
          <div class="product-meta">⭐ ${p.rating} · ${p.sold} terjual · ${p.sizes.join(', ')}</div>
          <a href="#" class="product-add" onclick="addToCart(${p.id});return false;">+ Keranjang</a>
        </div>
      </div>
    `).join('');
  }
  
  // ===== RENDER TESTIMONIALS =====
  async function loadTestimonials() {
    const data = await fetchJSON('data/testimonials.json');
    if (!data) return;
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    grid.innerHTML = data.testimonials.map(t => `
      <div class="testi-card">
        <div class="testi-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
        <p>"${t.text}"</p>
        <div class="testi-name">— ${t.name}, ${t.location}</div>
      </div>
    `).join('');
  }
  
  // ===== HELPERS =====
  function getCategoryIcon(cat) {
    const map = {
      gamis:  'i-gamis',
      kebaya: 'i-kebaya',
      kulot:  'i-kulot',
      khimar: 'i-khimar'
    };
    const id = map[cat] || 'i-sparkles';
    return `<svg class="icon icon-prod"><use href="#${id}"/></svg>`;
  }
  function getBadgeText(badge) {
    const texts = { new:'NEW', sale:'SALE', festive:'IED FITRI', custom:'CUSTOM', best:'BEST' };
    return texts[badge] || badge.toUpperCase();
  }
  function filterByCategory(catId) {
    window.location.href = `pages/catalog.html?cat=${catId}`;
  }
  
  // ===== NAVBAR =====
  function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
    }
  }
  
  // ===== SEARCH =====
  function initSearch() {
    const toggle = document.getElementById('searchToggle');
    const bar = document.getElementById('searchBar');
    if (toggle && bar) {
      toggle.addEventListener('click', () => {
        bar.classList.toggle('active');
        if (bar.classList.contains('active')) {
          document.getElementById('searchInput').focus();
        }
      });
    }
  }
  function searchProducts() {
    const q = document.getElementById('searchInput').value.trim();
    if (q) window.location.href = `pages/catalog.html?q=${encodeURIComponent(q)}`;
  }
  
  // ===== NEWSLETTER =====
  function subscribe() {
    const email = document.getElementById('emailInput').value.trim();
    if (!email || !email.includes('@')) {
      alert('Masukkan email yang valid ya! 📧');
      return;
    }
    alert('Terima kasih! Diskon 15% sudah dikirim ke ' + email + ' 🎉');
    document.getElementById('emailInput').value = '';
  }