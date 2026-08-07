// js/modules/siteContent.js
const SiteContent = {
    async init() {
      const s = await Data.get('site');
      if (!s) return;
      this.apply(s);
      // Sinkronkan dengan iconLoader kalau icon sudah siap
      if (window.IconLoader && IconLoader.icons && Object.keys(IconLoader.icons).length) {
        IconLoader.replaceIcons();
      }
    },
  
    set(sel, val) {
      const el = document.querySelector(sel);
      if (el && val != null) el.innerHTML = val;
    },
  
    apply(s) {
      this.set('.announcement', s.announcement);
  
      if (s.hero) {
        this.set('.hero-badge', s.hero.badge);
        this.set('.hero-text h1', s.hero.title1 + '<br><span class="accent">' + s.hero.titleAccent + '</span> ' + s.hero.title2);
        this.set('.hero-text p', s.hero.desc);
        const c1 = document.querySelector('.hero-btns .btn-primary');
        if (c1 && s.hero.cta1) { c1.innerHTML = s.hero.cta1.text; c1.href = s.hero.cta1.href; }
        const c2 = document.querySelector('.hero-btns .btn-outline');
        if (c2 && s.hero.cta2) { c2.innerHTML = s.hero.cta2.text; c2.href = s.hero.cta2.href; }
        this.set('.hero-icon', s.hero.visual);
        this.set('.hero-img-placeholder span:not(.hero-icon)', s.hero.visualCaption);
      }
  
      const headers = document.querySelectorAll('.section-header');
      const keys = ['categories', 'products', 'features', 'testimonials'];
      headers.forEach((h, i) => {
        const t = (s.sections || {})[keys[i]];
        if (!t) return;
        const h2 = h.querySelector('h2'), p = h.querySelector('p');
        if (h2) {
          h2.innerHTML = t.title.endsWith('.')
            ? t.title.slice(0, -1) + '<span class="dot">.</span>'
            : t.title;
        }
        if (p) p.textContent = t.subtitle;
      });
  
      if (s.festive) {
        this.set('.festive-tag', s.festive.tag);
        this.set('.festive-content h3', s.festive.title);
        this.set('.festive-content p', s.festive.desc);
        const fa = document.querySelector('.festive-content a');
        if (fa) { fa.innerHTML = s.festive.cta; fa.href = s.festive.href; }
      }
  
      if (s.byRequest) {
        this.set('.custom-request h3', s.byRequest.title);
        this.set('.custom-request > p', s.byRequest.desc);
        const steps = document.querySelector('.steps');
        if (steps && s.byRequest.steps) {
          steps.innerHTML = s.byRequest.steps.map((st, i) =>
            '<div class="step"><div class="step-num">' + (i + 1) + '</div><span>' + st + '</span></div>').join('');
        }
        const ca = document.querySelector('.custom-request a.btn-primary');
        if (ca) { ca.innerHTML = s.byRequest.cta; ca.href = s.byRequest.href; }
      }
  
      const fg = document.querySelector('.features-grid');
      if (fg && s.features) {
        fg.innerHTML = s.features.map(f => `
          <div class="feature-card">
            <div class="feature-icon">${f.icon}</div>
            <h4>${f.title}</h4>
            <p>${f.desc}</p>
            <a href="${f.href}" class="btn btn-sm">${f.cta}</a>
          </div>`).join('');
      }
  
      if (s.newsletter) {
        this.set('.newsletter h3', s.newsletter.title);
        this.set('.newsletter p', s.newsletter.desc);
        this.set('.newsletter .btn', s.newsletter.button);
      }
  
      if (s.footer) {
        this.set('.footer-bottom p:first-child', s.footer.copyright);
        this.set('.footer-bottom .tagline', s.footer.tagline);
        const soc = document.querySelector('.footer-grid > div:last-child');
        if (soc && s.footer.socials) {
          soc.innerHTML = '<h4>' + (s.footer.socialTitle || 'Hubungi Kami') + '</h4>' +
            s.footer.socials.map(x => '<a href="' + x.href + '">' + x.icon + ' ' + x.label + '</a>').join('');
        }
      }
    }
  };
  document.addEventListener('DOMContentLoaded', () => SiteContent.init());