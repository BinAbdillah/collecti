// ===== CART MODULE =====
const Cart = {
    items: [],
  
    init() {
      const saved = localStorage.getItem('pueny_cart');
      if (saved) this.items = JSON.parse(saved);
      this.updateUI();
    },
  
    add(productId, qty = 1) {
      const existing = this.items.find(i => i.id === productId);
      if (existing) {
        existing.qty += qty;
      } else {
        this.items.push({ id: productId, qty });
      }
      this.save();
      this.updateUI();
      this.showNotification('Ditambahkan ke keranjang! 🛒');
    },
  
    remove(productId) {
      this.items = this.items.filter(i => i.id !== productId);
      this.save();
      this.updateUI();
    },
  
    updateQty(productId, qty) {
      const item = this.items.find(i => i.id === productId);
      if (item) {
        item.qty = qty;
        if (qty <= 0) this.remove(productId);
        else { this.save(); this.updateUI(); }
      }
    },
  
    getTotal() {
      return this.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
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
        background:#3E2F23;color:#fff;padding:14px 24px;
        border-radius:12px;font-size:13px;z-index:9999;
        animation:fadeInUp .3s ease;
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };
  
  // Global function
  function addToCart(productId) {
    Cart.add(productId);
  }
  
  // Init
  document.addEventListener('DOMContentLoaded', () => Cart.init());