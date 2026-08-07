// js/modules/mixMatch.js
const MixMatch = {
  data: null,
  selected: { top: null, bottom: null, khimar: null },

  async init() {
    this.data = await Data.get('mixmatch');
    if (!this.data) return;
    (this.data.slots || []).forEach(s => this.renderOptions(s.id));
  },

  renderOptions(slot) {
    const container = document.getElementById('mm-' + slot);
    if (!container || !this.data.items[slot]) return;
    container.innerHTML = this.data.items[slot].map(item => `
      <div class="mm-option ${this.selected[slot]?.id === item.id ? 'selected' : ''}"
           onclick="MixMatch.select('${slot}','${item.id}')">
        <span class="mm-icon">${item.icon}</span>
        <span class="mm-name">${item.name}</span>
      </div>`).join('');
  },

  select(slot, itemId) {
    const item = (this.data.items[slot] || []).find(i => i.id === itemId);
    if (!item) return;
    this.selected[slot] = item;
    this.renderOptions(slot);
    this.renderPreview();
  },

  renderPreview() {
    const preview = document.getElementById('mm-preview');
    if (!preview) return;
    const { top, bottom, khimar } = this.selected;
    const complete = top && bottom && khimar;
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
          ${complete
            ? '<button class="btn btn-primary" onclick="MixMatch.addBundle()">+ Tambah Semua ke Keranjang</button>'
            : '<p style="color:#999;font-size:12px;">Pilih semua item untuk melihat total</p>'}
        </div>
      </div>`;
  },

  addBundle() {
    const ids = [this.selected.top, this.selected.bottom, this.selected.khimar]
      .filter(i => i && i.productId);
    if (typeof Cart !== 'undefined' && ids.length) {
      ids.forEach(i => Cart.add(i.productId));
    } else {
      alert('Semua item ditambahkan ke keranjang! 🛒✨');
    }
  }
};
document.addEventListener('DOMContentLoaded', () => MixMatch.init());
