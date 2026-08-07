// js/modules/styleMyLook.js
const StyleMyLook = {
  data: null,
  step: 0,
  answers: {},

  async init() {
    this.data = await Data.get('quiz');
    if (!this.data) return;
    this.renderStep();
  },

  renderStep() {
    const container = document.getElementById('sml-container');
    if (!container || !this.data) return;
    const qs = this.data.questions || [];
    if (this.step >= qs.length) { this.showResult(container); return; }
    const q = qs[this.step];
    container.innerHTML = `
      <div class="sml-progress"><div class="sml-bar" style="width:${(this.step / qs.length) * 100}%"></div></div>
      <p class="sml-step">Pertanyaan ${this.step + 1} dari ${qs.length}</p>
      <h3 class="sml-question">${q.question}</h3>
      <div class="sml-options">
        ${q.options.map(o => `
          <button class="sml-option" onclick="StyleMyLook.answer('${q.id}','${o.value}')">${o.label}</button>
        `).join('')}
      </div>`;
  },

  answer(qId, value) {
    this.answers[qId] = value;
    this.step++;
    this.renderStep();
  },

  getRecommendation() {
    const rec = this.data.recommendations || {};
    const out = [];
    const occ = (rec.occasion || {})[this.answers.occasion];
    if (occ) out.push(occ);
    const sty = (rec.style || {})[this.answers.style] || (rec.style || {})['_default'];
    if (sty) out.push(sty);
    return out.concat(rec.always || []).slice(0, 3);
  },

  showResult(container) {
    const rec = this.getRecommendation();
    container.innerHTML = `
      <div class="sml-result">
        <div style="font-size:60px;margin-bottom:16px;">🎉</div>
        <h3>Ini Gaya Untukmu!</h3>
        <p style="color:#888;margin:10px 0 20px;">Berdasarkan preferensimu, kami rekomendasikan:</p>
        <div class="sml-rec-cards">
          ${rec.map(r => `
            <div class="sml-rec-card">
              <div style="font-size:36px;">${r.icon}</div>
              <h4>${r.name}</h4>
              <p style="font-size:12px;color:#999;">${r.reason}</p>
              <a href="catalog.html?style=${this.answers.style}&color=${this.answers.color}" class="btn btn-sm btn-primary">Lihat</a>
            </div>`).join('')}
        </div>
        <button class="btn btn-outline" onclick="StyleMyLook.reset()" style="margin-top:20px;">🔄 Ulangi Quiz</button>
      </div>`;
  },

  reset() {
    this.step = 0;
    this.answers = {};
    this.renderStep();
  }
};
document.addEventListener('DOMContentLoaded', () => StyleMyLook.init());
