// ===== CART MODULE (FIXED) =====
const Cart = {
  items: [],
  products: [],

  init() {
    const saved = localStorage.getItem('pueny_cart');
    if (saved) {
      try { this.items = JSON.parse(saved); } catch (e) { this.items = []; }
    }
    // Simpan promise agar add() bisa menunggu data produk siap
    this.ready = this.loadProducts();
    this.updateUI();
  },

  async loadProducts() {
    try {
      const isPage = window.location.pathname.includes('/pages/');
      const path = isPage ? '../data/products.json' : 'data/products.json';
      const res = await fetch(path);
      if (!res.ok) throw new Error('not found');
      const data = await res.json();
      this.products = data.products;
      // Lengkapi item lama yang tersimpan tanpa price/name
      this.items = this.items.map(i => this.enrich(i));
    } catch (e) {
      console.warn('Cart: products.json gagal dimuat, total mungkin 0.');
    }
  },

  enrich(item) {
    const p = this.products.find(pr => pr.id === item.id);
    return {
      id: item.id,
      qty: item.qty,
      price: item.price ?? (p ? p.price : 0),
      name: item.name ?? (p ? p.name : 'Produk #' + item.id)
    };
  },

  async add(productId, qty = 1) {
    await this.ready; // tunggu data produk siap
    const p = this.products.find(pr => pr.id === productId);
    const existing = this.items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push(this.enrich({ id: productId, qty }));
    }
    this.save();
    this.updateUI();
    this.showNotification((p ? p.name : 'Produk') + ' ditambahkan! 🛒');
  },

  remove(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.save();
    this.updateUI();
  },

  updateQty(productId, qty) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      if (qty <= 0) this.remove(productId);
      else { item.qty = qty; this.save(); this.updateUI(); }
    }
  },

  getTotal() {
    return this.items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
  },

  getCount() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  save() {
    localStorage.setItem('pueny_cart', JSON.stringify(this.items));
  },

  clear() {
    this.items = [];
    this.save();
    this.updateUI();
  },

  updateUI() {
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = this.getCount();
  },

  showNotification(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = msg;
    toast.style.cssText = `
      position:fixed;bottom:30px;right:30px;
      background:#C9A96E;color:#111;padding:14px 24px;
      border-radius:12px;font-size:13px;font-weight:600;z-index:9999;
      box-shadow:0 8px 24px rgba(201,169,110,.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

// Global function (dipakai onclick di HTML)
function addToCart(productId, qty = 1) {
  Cart.add(productId, qty);
}

document.addEventListener('DOMContentLoaded', () => Cart.init());