// js/modules/cart.js - FINAL
const Cart = {
  items: [], products: [], cats: [],
  init() {
    try { const s = localStorage.getItem('pueny_cart'); if (s) this.items = JSON.parse(s); } catch (e) { this.items = []; }
    this.ready = this.loadData();
    this.updateUI();
  },
  async loadData() {
    try {
      const base = /\/(pages|admin)\//.test(location.pathname) ? '../' : '';
      const [p, c] = await Promise.all([fetch(base + 'data/products.json'), fetch(base + 'data/categories.json')]);
      if (p.ok) this.products = (await p.json()).products || [];
      if (c.ok) this.cats = (await c.json()).categories || [];
      this.items = this.items.map(i => this.enrich(i));
      this.updateUI();
    } catch (e) { console.warn('Cart: data gagal dimuat', e); }
  },
  enrich(i) {
    const p = this.products.find(x => x.id === i.id);
    const c = p && this.cats.find(x => x.id === p.category);
    return { id: i.id, qty: i.qty || 1, price: i.price ?? (p ? p.price : 0), name: i.name ?? (p ? p.name : 'Produk #' + i.id), icon: i.icon ?? (c ? c.icon : '🛍️') };
  },
  async add(id, qty = 1) {
    await this.ready;
    const ex = this.items.find(i => i.id === id);
    if (ex) ex.qty += qty; else this.items.push(this.enrich({ id, qty }));
    this.save(); this.updateUI();
    const it = this.items.find(i => i.id === id);
    this.toast((it ? it.name : 'Produk') + ' masuk keranjang! 🛒');
  },
  remove(id) { this.items = this.items.filter(i => i.id !== id); this.save(); this.updateUI(); },
  updateQty(id, qty) { if (qty <= 0) return this.remove(id); const it = this.items.find(i => i.id === id); if (it) { it.qty = qty; this.save(); this.updateUI(); } },
  getTotal() { return this.items.reduce((s, i) => s + (i.price || 0) * i.qty, 0); },
  getCount() { return this.items.reduce((s, i) => s + i.qty, 0); },
  save() { localStorage.setItem('pueny_cart', JSON.stringify(this.items)); },
  clear() { this.items = []; this.save(); this.updateUI(); },
  updateUI() {
    const b = document.getElementById('cartCount');
    if (b) b.textContent = this.getCount();
    this.render();
  },
  render() {
    const w = document.getElementById('cartItems');
    if (!w) return;
    if (!this.items.length) {
      w.innerHTML = '<div class="cart-empty"><div class="icon">🛍️</div><p>Keranjangmu masih kosong.</p><a href="catalog.html" class="btn btn-primary" style="margin-top:16px;">Yuk Belanja!</a></div>';
    } else {
      w.innerHTML = this.items.map(i => `
        <div class="cart-item">
          <div class="cart-item-img">${i.icon}</div>
          <div class="cart-item-info"><h4>${i.name}</h4><p>Rp ${(i.price || 0).toLocaleString('id-ID')} / pcs</p></div>
          <div class="cart-item-qty">
            <button onclick="Cart.updateQty(${i.id},${i.qty - 1})">−</button><span>${i.qty}</span>
            <button onclick="Cart.updateQty(${i.id},${i.qty + 1})">+</button>
          </div>
          <div class="cart-item-price">Rp ${((i.price || 0) * i.qty).toLocaleString('id-ID')}</div>
          <div class="cart-item-remove" onclick="Cart.remove(${i.id})">✕</div>
        </div>`).join('');
    }
    const t = 'Rp ' + this.getTotal().toLocaleString('id-ID');
    const g = id => document.getElementById(id);
    if (g('sumSubtotal')) g('sumSubtotal').textContent = t;
    if (g('sumTotal')) g('sumTotal').textContent = t;
    if (g('sumCount')) g('sumCount').textContent = 'Subtotal (' + this.getCount() + ' item)';
  },
  toast(msg) {
    const d = document.createElement('div');
    d.textContent = msg;
    d.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#C9A96E;color:#111;padding:14px 24px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(201,169,110,.3);';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 3000);
  }
};
function addToCart(id, qty = 1) { Cart.add(id, qty); }
document.addEventListener('DOMContentLoaded', () => Cart.init());