// ===== MIX & MATCH BUILDER =====
const MixMatch = {
    selected: { top: null, bottom: null, khimar: null },
  
    items: {
      top: [
        { id: 't1', name: 'Gamis Aisyah - Sage', icon: '👗', color: '#A8B5A0' },
        { id: 't2', name: 'Kebaya Zahra - Dusty', icon: '👫', color: '#D4A574' },
        { id: 't3', name: 'Tunik Nadia - Cream', icon: '👚', color: '#F5E6D3' },
      ],
      bottom: [
        { id: 'b1', name: 'Kulot Plisket - Mocca', icon: '👖', color: '#C4A882' },
        { id: 'b2', name: 'Kulot Palazzo - Navy', icon: '👖', color: '#2C3E50' },
        { id: 'b3', name: 'Rok Plisket - Black', icon: '🩱', color: '#1a1a1a' },
      ],
      khimar: [
        { id: 'k1', name: 'Khimar Cream', icon: '🧕', color: '#FFF8DC' },
        { id: 'k2', name: 'Khimar Black', icon: '🧕', color: '#111' },
        { id: 'k3', name: 'Khimar Sage', icon: '🧕', color: '#A8B5A0' },
      ]
    },
  
    init() {
      this.renderOptions('top');
      this.renderOptions('bottom');
      this.renderOptions('khimar');
    },
  
    renderOptions(slot) {
      const container = document.getElementById(`mm-${slot}`);
      if (!container) return;
      container.innerHTML = this.items[slot].map(item => `
        <div class="mm-option ${this.selected[slot]?.id === item.id ? 'selected' : ''}"
             onclick="MixMatch.select('${slot}','${item.id}')">
          <span class="mm-icon">${item.icon}</span>
          <span class="mm-name">${item.name}</span>
        </div>
      `).join('');
    },
  
    select(slot, itemId) {
      const item = this.items[slot].find(i => i.id === itemId);
      this.selected[slot] = item;
      this.renderOptions(slot);
      this.renderPreview();
    },
  
    renderPreview() {
      const preview = document.getElementById('mm-preview');
      if (!preview) return;
      const { top, bottom, khimar } = this.selected;
      preview.innerHTML = `
        <div class="mm-result">
          <div class="mm-mannequin">
            <div style="font-size:60px;">${khimar ? khimar.icon : '❓'}</div>
            <div style="font-size:50px;">${top ? top.icon : '❓'}</div>
            <div style="font-size:50px;">${bottom ? bottom.icon : '❓'}</div>
          </div>
          <div class="mm-summary">
            <p><strong>Atasan:</strong> ${top ? top.name : 'Belum dipilih'}</p>
            <p><strong>Bawahan:</strong> ${bottom ? bottom.name : 'Belum dipilih'}</p>
            <p><strong>Khimar:</strong> ${khimar ? khimar.name : 'Belum dipilih'}</p>
            ${top && bottom && khimar ? '<button class="btn btn-primary" onclick="MixMatch.addBundle()">+ Tambah Semua ke Keranjang</button>' : '<p style="color:#999;font-size:12px;">Pilih semua item untuk melihat total</p>'}
          </div>
        </div>
      `;
    },
  
    addBundle() {
      alert('Semua item ditambahkan ke keranjang! 🛒✨');
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => MixMatch.init());
