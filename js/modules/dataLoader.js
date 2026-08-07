// js/modules/dataLoader.js
const Data = {
    base() {
      return /\/(pages|admin)\//.test(location.pathname) ? '../' : '';
    },
    async get(name) {
      try {
        const res = await fetch(this.base() + 'data/' + name + '.json');
        if (!res.ok) throw new Error(name + '.json tidak ditemukan');
        return await res.json();
      } catch (e) {
        console.warn('DataLoader: gagal memuat ' + name + '.json', e);
        return null;
      }
    }
  };