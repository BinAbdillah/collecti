// ===== SIZE FINDER MODULE =====
const SizeFinder = {
    init() {
      const form = document.getElementById('sizeForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.calculate();
        });
      }
    },
  
    calculate() {
      const height = parseInt(document.getElementById('sf-height')?.value) || 0;
      const weight = parseInt(document.getElementById('sf-weight')?.value) || 0;
      const category = document.getElementById('sf-category')?.value || 'gamis';
  
      if (!height || !weight) {
        alert('Mohon isi tinggi dan berat badan ya! 📏');
        return;
      }
  
      const bmi = weight / ((height / 100) ** 2);
      let size = this.getSize(bmi, height, category);
      this.showResult(size, bmi, category);
    },
  
    getSize(bmi, height, category) {
      if (category === 'khimar') return 'All Size';
      if (bmi < 18.5) return height < 160 ? 'S' : 'M';
      if (bmi < 23) return height < 160 ? 'M' : 'L';
      if (bmi < 27) return height < 165 ? 'L' : 'XL';
      return height < 165 ? 'XL' : 'XXL';
    },
  
    showResult(size, bmi, category) {
      const result = document.getElementById('sf-result');
      if (!result) return;
      const catNames = { gamis: 'Gamis', kebaya: 'Kebaya', kulot: 'Kulot', khimar: 'Khimar' };
      result.innerHTML = `
        <div class="sf-result-card">
          <div class="sf-result-icon">📐</div>
          <h4>Rekomendasi Ukuran Kamu</h4>
          <div class="sf-size">${size}</div>
          <p>Untuk kategori: <strong>${catNames[category] || category}</strong></p>
          <p style="font-size:12px;color:#999;margin-top:8px;">
            BMI: ${bmi.toFixed(1)} · Tinggi: ${document.getElementById('sf-height').value} cm · Berat: ${document.getElementById('sf-weight').value} kg
          </p>
          <a href="catalog.html?size=${size}" class="btn btn-primary btn-sm" style="margin-top:14px;">
            Lihat Produk Ukuran ${size}
          </a>
        </div>
      `;
      result.style.display = 'block';
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => SizeFinder.init());