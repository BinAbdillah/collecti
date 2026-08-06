// ===== STYLE MY LOOK MODULE =====
const StyleMyLook = {
    step: 0,
    answers: {},
  
    questions: [
      {
        id: 'occasion',
        question: 'Untuk acara apa kamu butuh outfit?',
        options: [
          { value: 'daily', label: '🏠 Daily / Hangout' },
          { value: 'office', label: '💼 Kantor / Formal' },
          { value: 'condangan', label: '🎉 Kondangan / Acara' },
          { value: 'lebaran', label: '🌙 Lebaran / Hari Raya' }
        ]
      },
      {
        id: 'style',
        question: 'Gaya apa yang kamu suka?',
        options: [
          { value: 'simple', label: '✨ Simple & Minimalis' },
          { value: 'elegant', label: '👑 Elegan & Mewah' },
          { value: 'playful', label: '🌈 Colorful & Fun' },
          { value: 'syari', label: '🧕 Syar\'i & Longgar' }
        ]
      },
      {
        id: 'color',
        question: 'Warna favorit kamu?',
        options: [
          { value: 'neutral', label: '🤍 Netral (Cream, Putih, Abu)' },
          { value: 'earth', label: '🤎 Earth Tone (Mocca, Sage, Terracotta)' },
          { value: 'dark', label: '🖤 Gelap (Navy, Black, Maroon)' },
          { value: 'pastel', label: '💜 Pastel (Dusty, Lilac, Peach)' }
        ]
      },
      {
        id: 'budget',
        question: 'Budget kamu berapa?',
        options: [
          { value: 'low', label: '💰 Under Rp 100.000' },
          { value: 'mid', label: '💰💰 Rp 100.000 - 200.000' },
          { value: 'high', label: '💰💰💰 Rp 200.000+' }
        ]
      }
    ],
  
    init() {
      this.renderStep();
    },
  
    renderStep() {
      const container = document.getElementById('sml-container');
      if (!container) return;
  
      if (this.step >= this.questions.length) {
        this.showResult(container);
        return;
      }
  
      const q = this.questions[this.step];
      container.innerHTML = `
        <div class="sml-progress">
          <div class="sml-bar" style="width:${((this.step) / this.questions.length) * 100}%"></div>
        </div>
        <p class="sml-step">Pertanyaan ${this.step + 1} dari ${this.questions.length}</p>
        <h3 class="sml-question">${q.question}</h3>
        <div class="sml-options">
          ${q.options.map(opt => `
            <button class="sml-option" onclick="StyleMyLook.answer('${q.id}','${opt.value}')">
              ${opt.label}
            </button>
          `).join('')}
        </div>
      `;
    },
  
    answer(qId, value) {
      this.answers[qId] = value;
      this.step++;
      this.renderStep();
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
              </div>
            `).join('')}
          </div>
          <button class="btn btn-outline" onclick="StyleMyLook.reset()" style="margin-top:20px;">🔄 Ulangi Quiz</button>
        </div>
      `;
    },
  
    getRecommendation() {
      const { occasion, style, color } = this.answers;
      const recs = [];
  
      if (occasion === 'daily') recs.push({ icon: '👗', name: 'Gamis Daily', reason: 'Nyaman untuk aktivitas sehari-hari' });
      if (occasion === 'office') recs.push({ icon: '👚', name: 'Tunik + Kulot', reason: 'Profesional tapi tetap modest' });
      if (occasion === 'condangan') recs.push({ icon: '👫', name: 'Kebaya Muslimah', reason: 'Elegan untuk acara spesial' });
      if (occasion === 'lebaran') recs.push({ icon: '🌙', name: 'Koleksi Ied Fitri', reason: 'Spesial untuk Hari Kemenangan' });
  
      if (style === 'syari') recs.push({ icon: '🧕', name: 'Khimar Syar\'i', reason: 'Menutup sempurna, tetap stylish' });
      else recs.push({ icon: '🧣', name: 'Khimar Instan', reason: 'Praktis dan versatile' });
  
      recs.push({ icon: '👖', name: 'Kulot Plisket', reason: 'Mix & match dengan atasan apapun' });
  
      return recs.slice(0, 3);
    },
  
    reset() {
      this.step = 0;
      this.answers = {};
      this.renderStep();
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => StyleMyLook.init());