// js/admin.js
const Admin = {
    async init() {
      const base = /\/(pages|admin)\//.test(location.pathname) ? '../' : '';
      try {
        const [o, r] = await Promise.all([
          fetch(base + 'data/orders.json').then(x => x.ok ? x.json() : null),
          fetch(base + 'data/requests.json').then(x => x.ok ? x.json() : null)
        ]);
        if (o) { this.renderStats(o.orders || []); this.renderOrders(o.orders || []); }
        if (r) this.renderRequests(r.requests || []);
      } catch (e) { console.warn('Admin: data gagal dimuat', e); }
    },
  
    statusLabel(s) {
      return { shipped: 'Dikirim', processing: 'Diproses', pending: 'Pending', done: 'Selesai', progress: 'Dikerjakan' }[s] || s;
    },
  
    // Dashboard: isi angka stat otomatis (dihitung dari data!)
    renderStats(orders) {
      const nums = document.querySelectorAll('.stat-num');
      if (!nums.length) return;
      const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
      const pending = orders.filter(o => o.status === 'pending').length;
      const vals = [orders.length, 'Rp ' + (revenue / 1000000).toFixed(1) + ' Jt', '89', pending];
      nums.forEach((el, i) => { if (vals[i] != null) el.textContent = vals[i]; });
    },
  
    renderOrders(orders) {
      const tbody = document.querySelector('.admin-table tbody');
      if (!tbody) return;
      tbody.innerHTML = orders.map(o => `
        <tr>
          <td>${o.id}</td><td>${o.customer}</td><td>${o.items}</td>
          <td>Rp ${(o.total || 0).toLocaleString('id-ID')}</td>
          <td><span class="status ${o.status}">${this.statusLabel(o.status)}</span></td>
        </tr>`).join('');
    },
  
    renderRequests(reqs) {
      const wrap = document.getElementById('requestsList');
      if (!wrap) return;
      wrap.innerHTML = reqs.map(r => `
        <div class="req-card">
          <div class="req-head"><strong>${r.id} · ${r.name}</strong><span class="status ${r.status}">${this.statusLabel(r.status)}</span></div>
          <p>📱 ${r.wa} · 🗓️ ${r.date}</p>
          <p><strong>${r.category}</strong> · Ukuran ${r.size} · Bahan ${r.material} · Warna ${r.color}</p>
          <p class="req-note">📝 ${r.note}</p>
        </div>`).join('');
    }
  };
  document.addEventListener('DOMContentLoaded', () => Admin.init());