(function () {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const toolbar = document.createElement('div');
  toolbar.className = 'category-search-bar';
  toolbar.setAttribute('role', 'search');
  toolbar.setAttribute('aria-label', 'Search products in this category');
  toolbar.innerHTML = `
    <div class="category-search-input-wrap">
      <span class="category-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="10.8" cy="10.8" r="6.8"></circle>
          <path d="m16 16 5 5"></path>
        </svg>
      </span>
      <input class="category-product-search" type="search" placeholder="Search products in this category..." aria-label="Search products in this category">
    </div>
  `;
  grid.insertAdjacentElement('beforebegin', toolbar);

  const emptyMessage = document.createElement('p');
  emptyMessage.className = 'category-search-empty';
  emptyMessage.textContent = 'No products match your search.';
  emptyMessage.hidden = true;
  grid.insertAdjacentElement('afterend', emptyMessage);
  const input = toolbar.querySelector('.category-product-search');
  const listeners = [];
  let query = '';

  function searchableText(product) {
    return Object.entries(product)
      .filter(([key]) => !['id', 'gallery', 'image', 'images', 'video'].includes(key.toLowerCase()))
      .flatMap(([, value]) => {
        if (typeof value === 'string' || typeof value === 'number') return [String(value)];
        if (Array.isArray(value)) return value.filter(item => typeof item === 'string');
        return [];
      })
      .join(' ')
      .toLocaleLowerCase();
  }

  const search = {
    get query() {
      return query;
    },
    filter(products) {
      const filtered = query
        ? products.filter(product => searchableText(product).includes(query))
        : products;
      this.updateCount(filtered.length);
      return filtered;
    },
    updateCount(matches) {
      emptyMessage.hidden = matches > 0;
    },
    onChange(listener) {
      listeners.push(listener);
    }
  };

  input.addEventListener('input', () => {
    query = input.value.trim().toLocaleLowerCase();
    listeners.forEach(listener => listener());
  });

  window.RIVER_CATEGORY_SEARCH = search;
})();
