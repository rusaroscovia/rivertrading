(function () {
  const catalog = window.RIVER_PRODUCT_CATALOG_CONFIG || {};
  const products = [...(catalog.products || window.RIVER_SAFETY_PRODUCTS)];
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('Product catalogue data did not load.');
  }
  products.sort((first, second) => first.name.localeCompare(second.name, undefined, { sensitivity: 'base' }));

  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
  const displayValue = value => value || 'Not specified in the source list.';
  const categoryLabel = catalog.categoryLabel || 'Safety & Protection';
  const heading = catalog.heading || 'Safety';
  const detailsLabel = catalog.detailsLabel || 'Safety';
  const introText = catalog.introText || 'Browse safety and protective equipment, workwear, and related supplies from River Trading Ltd.';
  const pageSize = 12;
  let currentPage = 1;
  let lastFocusedProductButton = null;

  const sectionIntro = document.querySelector('.section-intro');
  sectionIntro.querySelector('.story-label-text').textContent = categoryLabel;
  sectionIntro.querySelector('h2').innerHTML = `${escapeHtml(heading)} <em>Products</em>`;
  sectionIntro.querySelector('p').textContent = introText;

  const tabs = document.getElementById('secTabs');
  tabs.hidden = true;
  const oldGrid = document.getElementById('productGrid');
  const grid = oldGrid.cloneNode(false);
  oldGrid.replaceWith(grid);
  const oldPager = document.getElementById('pagination');
  const pager = oldPager.cloneNode(false);
  oldPager.replaceWith(pager);

  const modal = document.getElementById('productModal');
  modal.setAttribute('aria-labelledby', 'modalName');
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-hero">
        <div class="modal-hero-shade"></div>
        <div class="modal-hero-content">
          <p class="modal-cat">${escapeHtml(detailsLabel)} Product Details</p>
          <h2 class="modal-name" id="modalName"></h2>
        </div>
        <span class="modal-video-status">Product photos were not included in the supplied list.</span>
      </div>
      <button class="modal-close" id="modalClose" type="button" aria-label="Close">&#215;</button>
      <section class="product-gallery" aria-label="Product photos">
        <div class="gallery-stage"><span class="gallery-image-placeholder">Product photos were not included in the supplied list.</span></div>
        <p class="gallery-file-hint">Product photos were not included in the supplied list.</p>
      </section>
      <div class="modal-body">
        <dl class="modal-details">
          <div><dt>Description / Size</dt><dd id="modalDescription"></dd></div>
          <div><dt>Pieces per Carton</dt><dd id="modalPcsPerCarton"></dd></div>
          <div><dt>Source List Number</dt><dd id="modalSourceNumber"></dd></div>
          <div id="modalAdditionalInformationRow" hidden><dt>Additional Information</dt><dd id="modalAdditionalInformation"></dd></div>
        </dl>
      </div>
    </div>
  `;
  const modalClose = document.getElementById('modalClose');

  function renderProducts() {
    const filteredProducts = window.RIVER_CATEGORY_SEARCH.filter(products);
    const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * pageSize;
    grid.innerHTML = filteredProducts.slice(start, start + pageSize).map(product => `
      <article class="prod-card">
        <div class="prod-img"><span>Product image</span></div>
        <div class="prod-body">
          <h3 class="prod-name">${escapeHtml(product.name)}</h3>
          <p class="prod-size"><span class="prod-spec-icon" aria-hidden="true">&#128230;</span> ${escapeHtml(displayValue(product.description))}</p>
          <p class="prod-meta">Pieces per carton: ${escapeHtml(displayValue(product.pcsPerCarton))}</p>
          <div class="prod-footer">
            <button class="btn-view" type="button" data-product-id="${escapeHtml(product.id)}" aria-label="View ${escapeHtml(product.name)} details">
              View More <span aria-hidden="true">&#8594;</span>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    let pagination = `<button class="page-btn" data-page="${currentPage - 1}"${currentPage === 1 ? ' disabled' : ''}>&#8249; Prev</button>`;
    const windowStart = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
    const windowEnd = Math.min(pageCount, windowStart + 4);

    if (windowStart > 1) {
      pagination += '<button class="page-btn" data-page="1" aria-label="Page 1">1</button>';
      if (windowStart > 2) pagination += '<span class="page-dots">&#8230;</span>';
    }
    for (let page = windowStart; page <= windowEnd; page++) {
      pagination += `<button class="page-btn${page === currentPage ? ' active' : ''}" data-page="${page}" aria-label="Page ${page}"${page === currentPage ? ' aria-current="page"' : ''}>${page}</button>`;
    }
    if (windowEnd < pageCount) {
      if (windowEnd < pageCount - 1) pagination += '<span class="page-dots">&#8230;</span>';
      pagination += `<button class="page-btn" data-page="${pageCount}" aria-label="Page ${pageCount}">${pageCount}</button>`;
    }
    pagination += `<button class="page-btn" data-page="${currentPage + 1}"${currentPage === pageCount ? ' disabled' : ''}>Next &#8250;</button>`;
    pager.innerHTML = pagination;
    pager.classList.toggle('hidden', pageCount <= 1);
  }

  function openProductModal(id, trigger) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    lastFocusedProductButton = trigger;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalDescription').textContent = displayValue(product.description);
    document.getElementById('modalPcsPerCarton').textContent = displayValue(product.pcsPerCarton);
    document.getElementById('modalSourceNumber').textContent = product.sourceNumber;
    document.getElementById('modalAdditionalInformation').textContent = product.additionalInformation || '';
    document.getElementById('modalAdditionalInformationRow').hidden = !product.additionalInformation;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeProductModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedProductButton && lastFocusedProductButton.isConnected) {
      lastFocusedProductButton.focus();
    }
  }

  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-product-id]');
    if (button) openProductModal(button.dataset.productId, button);
  });
  pager.addEventListener('click', event => {
    const button = event.target.closest('.page-btn');
    if (!button || button.disabled) return;
    currentPage = Number(button.dataset.page);
    renderProducts();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  modalClose.addEventListener('click', closeProductModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeProductModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeProductModal();
  });

  window.openModal = openProductModal;
  window.closeModal = closeProductModal;
  window.RIVER_CATEGORY_SEARCH.onChange(() => {
    currentPage = 1;
    renderProducts();
  });
  renderProducts();
})();
