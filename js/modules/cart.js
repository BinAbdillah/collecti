// js/modules/cart.js
const Cart = {
  items: [],
  products: [],
  cats: [],

  init() {
    try {
      const saved = localStorage.getItem('pueny_cart');
      if (saved) this.items = JSON.parse(saved);
    } catch (e) { this.items = []; }
    this.ready = this.loadData();
    this.updateUI();
  },

  async loadData() {
    try {
      const isPage = window.location.pathname.includes('/pages/');
      const base = isPage ? '../' : '';
      const [pRes, cRes] = await Promise.all([
        fetch(base + 'data/products.json'),
        fetch(base + 'data/categories.json')
      ]);
      if (pRes.ok) this.products = (await pRes.json()).products || [];
      if (cRes.ok) this.cats = (await cRes.json()).categories || [];
      this.items = this.items.map(i => this.enrich(i));
      this.updateUI();
    } catch (e) {
      console.warn('Cart: data produk gagal dimuat.', e);
    }
  },

  catIcon(cat) {
    const c = this.cats.find(x => x.id === cat);
    return c ? c.icon : '🛍️';
  },

  enrich(item) {
    const p = this.products.find(pr => pr.id === item.id);
    return {
      id: item.id,
      qty: item.qty || 1,
      price: item.price ?? (p ? p.price : 0),
      name: item.name ?? (p ? p.name : 'Produk #' + item.id),
      icon: item.icon ?? (p ? this.catIcon(p.category) : '🛍️')
    };
  },

  async add(productId, qty = 1) {
    await this.ready;
    const existing = this.items.find(i => i.id === productId);
    if (existing) existing.qty += qty;
    else this.items.push(this.enrich({ id: productId, qty }));
    this.save();
    this.updateUI();
    const it = this.items.find(i => i.id === productId);
    this.showNotification((it ? it.name : 'Produk') + ' masuk keranjang! 🛒');
  },

  remove(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.save();
    this.updateUI();
  },

  updateQty(productId, qty) {
    if (qty <= 0) return this.remove(productId);
    const item = this.items.find(i => i.id === productId);
    if (item) { item.qty = qty; this.save(); this.updateUI(); }
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
    this.renderCart();
  },

  // Render isi keranjang (aktif kalau ada elemen di halaman)
  renderCart() {
    const wrap = document.getElementById('cartItems');
    if (!wrap) return;

    if (!this.items.length) {
      wrap.innerHTML = `
        <div class="cart-empty">
          <div class="icon">🛒</div>
          <p>Keranjangmu masih kosong.</p>
          <a href="catalog.html" class="btn btn-primary" style="margin-top:16px;">Yuk Belanja!</a>
        </div>`;
    } else {
      wrap.innerHTML = this.items.map(i => `
        <div class="cart-item">
          <div class="cart-item-img">${i.icon}</div>
          <div class="cart-item-info">
            <h4>${i.name}</h4>
            <p>Rp ${(i.price || 0).toLocaleString('id-ID')} / pcs</p>
          </div>
          <div class="cart-item-qty">
            <button onclick="Cart.updateQty(${i.id}, ${i.qty - 1})">−</button>
            <span>${i.qty}</span>
            <button onclick="Cart.updateQty(${i.id}, ${i.qty + 1})">+</button>
          </div>
          <div class="cart-item-price">Rp ${((i.price || 0) * i.qty).toLocaleString('id-ID')}</div>
          <div class="cart-item-remove" onclick="Cart.remove(${i.id})">✕</div>
        </div>`).join('');
    }

    const total = 'Rp ' + this.getTotal().toLocaleString('id-ID');
    const sub = document.getElementById('sumSubtotal');
    const tot = document.getElementById('sumTotal');
    const cnt = document.getElementById('sumCount');
    if (sub) sub.textContent = total;
    if (tot) tot.textContent = total;
    if (cnt) cnt.textContent = 'Subtotal (' + this.getCount() + ' item)';
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

// Global (dipakai onclick di HTML)
function addToCart(productId, qty = 1) {
  Cart.add(productId, qty);
}

document.addEventListener('DOMContentLoaded', () => Cart.init());