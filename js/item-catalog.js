(() => {
  const items = window.RIVER_ITEM_LIST;
  if (!Array.isArray(items)) {
    throw new Error('Stock catalogue data did not load.');
  }

  const cards = document.getElementById('inventoryCards');
  const emptyMessage = document.getElementById('inventoryEmpty');
  const pagination = document.getElementById('inventoryPagination');
  const detailOverlay = document.getElementById('inventoryDetail');
  const detailPreview = document.getElementById('inventoryDetailPreview');
  const mediaList = document.getElementById('inventoryMediaList');
  const itemMedia = window.RIVER_ITEM_MEDIA || {};
  const pageSize = 25;
  let currentPage = 1;
  let activeMediaItems = [];
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  const categoryRules = [
    { id: 'electrical', label: 'Electrical & Lighting', pattern: /\b(electric(?:al|ity)?|cable|wire|plug|socket|switch|bulb|lamp|lighting|led|legrand|battery|charger|fuse|fusible|meter|connect\w*|extension plug|soldering iron|headlight|generator|inverter|solar|multimeter)\b/i },
    { id: 'plumbing', label: 'Plumbing & Water', pattern: /\b(pipe|ppr|pvc|valve|tap|faucet|basin|toilet|shower|shattaf|water pump|well pump|oil well pump|plumbing|elbow|coude|drain|sink|cistern|mixer|hydrant|manchon)\b/i },
    { id: 'cleaning', label: 'Cleaning & Janitorial', pattern: /\b(broom\w*|besom\w*|brush\w*|mop\w*|detergent\w*|hand wash|dish cloth|dish washing|tissue\w*|napkin\w*|serviette\w*|paper towel|toilet paper|cleaning|wash|soap|sponge|dust bin|dustbin|dust brush|wiper|disinfect|bleach|squeegee|scrub|air freshener|air freshner|sanitizer|sanitiser|ironing board|roll\w* poa)\b/i },
    { id: 'safety', label: 'Safety & Workwear', pattern: /\b(helmet|safety|protective|fire extinguisher|fire blanket|fire exit|fire cabinet|ear muff\w*|ear plug\w*|goggle\w*|glasse?s|mask\w*|glove\w*|respirator|reflective|life jacket|first aid|workwear|work wear|raincoat|rain coat|safety boot|safety shoe|lifting belt|no parking|no smoking|whistle|bath gloves)\b/i },
    { id: 'automotive', label: 'Automotive & Transport', pattern: /\b(car|automotive|automobile|auto part|vehicle|motorcycle|motor bike|bicycle|bike|tyre|tire|car seat|steering wheel|car wash|car shampoo|car wax|car warning|jump lead|spark plug|headlight|inflator)\b/i },
    { id: 'agriculture', label: 'Agriculture & Garden', pattern: /\b(agri|farm|garden|plant|seed|sprayer|spray pump|farm jet|hoe|rake|shovel|spade|sickle|machete|panga|prun|watering|irrigat|grass cutter|brush cutter|lawn|weed|fertiliz|animal feed|baler|twine|edge trimmer)\b/i },
    { id: 'personal-care', label: 'Personal Care & Salon', pattern: /\b(barber|salon|hair|nail polish|cosmetic|makeup|comb|shaving|shave|beauty|wig|manicure|pedicure|hair clipper|hair dryer|hair brush|neck paper)\b/i },
    { id: 'party', label: 'Party & Celebration', pattern: /\b(balloon\w*|birthday|party|fireworks|fire works|decoration|decorative|decolation|crown|confetti|gift wrap|gift bag|floral foam)\b/i },
    { id: 'sports', label: 'Sports & Recreation', pattern: /\b(sport|boxing|football|basketball|volleyball|tennis|badminton|gym|fitness|exercise|skipping rope|toy|game|arm trainer|hand grip|pedal set)\b/i },
    { id: 'household', label: 'Kitchen & Household', pattern: /\b(kitchen|cook|cooking|utensil|plate|cup|mug|spoon|fork|knife|pan|pot|kettle|storage|basket|carpet|curtain|clothes line|cloth line|clothes fork|hanger|bowl|food|flask|thermos|household|laundry|ironing board|candle|gourde|gas grill\w*|milk bottle|mirror|pillow|stool|salt|soap box|metal cash box|safe box|cash box|handle|key ring|key tag)\b/i },
    { id: 'packaging', label: 'Packaging & Ropes', pattern: /\b(packaging|packing|poly bag|plastic bag|paper bag|rope|cord|string|packing tape|stretch film|wrapping|sack|carton|baler twine|rubber band|plastic wrap|plastic sheet)\b/i },
    { id: 'chemicals', label: 'Adhesives, Paint & Chemicals', pattern: /\b(adhes\w*|glue|arali?dit|epoxy|silicone|sealant|paint\w*|varnish|thinner|chemical|solvent|caustic soda|acid|lubricant|grease|engine oil|machine oil|ant.?rust|spray paint|cement cole|iron oxide|diamond liquid|liquid mosquito|mosquito (killer|repellent)|repellent coil|glass putty|pu foam|sea salt)\b/i },
    { id: 'material-handling', label: 'Lifting & Material Handling', pattern: /\b(caster\w*|wheel\w*|trolley|capstan|hoist|sling|pulley|lifting|lift\b|jack\b|dolly|handling|hydraulic jack)\b/i },
    { id: 'measuring', label: 'Scales & Measuring', pattern: /\b(scale|scales|weighing|crane scale|caliper|gauge|measuring|levelling rod|leveling rod|detector|pressure table|thermometer)\b/i },
    { id: 'medical', label: 'Health & Accessibility', pattern: /\b(medical|health|fetal|disabled|disability|left foot|right foot|crutch|wheelchair|pressure table|first aid)\b/i },
    { id: 'hardware', label: 'Fasteners & Hardware', pattern: /\b(bolt\w*|nut\w*|screw\w*|nail\w*|rivet\w*|hinge\w*|lock\w*|chain\w*|clamp\w*|clip\w*|staple\w*|hook\w*|hasp|padlock\w*|pod lack|anchor|fastener|pulley|barbed wire|barbed rope|wire mesh|iron scissor|magnetic sleeve|grounding rod)\b/i },
    { id: 'tools', label: 'Tools & Workshop', pattern: /\b(tool\w*|wrench\w*|spanner\w*|plier\w*|cutter\w*|hammer\w*|saw\w*|drill\w*|chis\w*|screwdriver\w*|file\w*|grinder\w*|trowel\w*|level\w*|ladder\w*|measuring|caliper|vice|vise|torch|welding|welder|solder|workshop|auger|blade|chuck|socket set|crow bar|crowbar|scraper|c-clamp|art knife|machine|grinding|polishing pad|polishing disk|sandpaper|sand paper|abrasive|iron scissor|chalk line|grinding head|heat gun|scissor\w*|key machine|jarring machine|agitator|stirrer|glass sucker|copper brazing|fiber disc|oil stone|pick axe|measure tape|joint filler gun|dredging device|bubble right|bat ter)\b/i },
    { id: 'construction', label: 'Building & Construction', pattern: /\b(construction|building|cement|concrete|brick|roof|roofing|tile|ceramic|plaster|asphalt|corrugated|insulation|waterproof|scaffold|wall|floor|gypsum|ceiling|rebar|steel bar|building material|glass wool|grout|fiber sheet|shade net|floral foam)\b/i }
  ];
  const requestedCategory = new URLSearchParams(window.location.search).get('stock-category');
  const activeCategory = categoryRules.find(category => category.id === requestedCategory) || null;
  const categoryHeading = document.getElementById('inventoryCategoryHeading');

  function getCategory(item) {
    const searchable = `${item.item} ${item.specification}`.toLocaleLowerCase();
    if (/\b(barbed wire|barbed rope|wire mesh|grounding rod)\b/.test(searchable)) return 'hardware';
    if (/\b(car wash|car shampoo|car wax|car warning|car seat|auto part|automobile|motorcycle|bicycle)\b/.test(searchable)) return 'automotive';
    if (/\b(barber|salon|hair|nail polish|cosmetic|makeup|manicure|pedicure|neck paper)\b/.test(searchable)) return 'personal-care';
    if (/\b(brush cutter|edge trimmer|grass cutter)\b/.test(searchable)) return 'agriculture';
    if (/\b(paint brush|paint roller)\b/.test(searchable)) return 'tools';
    const match = categoryRules.find(category => category.pattern.test(searchable));
    return match ? match.id : 'general';
  }

  function render() {
    const visibleItems = activeCategory
      ? items.filter(item => getCategory(item) === activeCategory.id)
      : items;
    const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * pageSize;
    const pageItems = visibleItems.slice(start, start + pageSize);

    cards.innerHTML = pageItems.map(item => {
      const index = items.indexOf(item);

      return `
        <article class="inventory-card">
          <div class="inventory-card-image" role="img" aria-label="Product image to be added">
            <span>Product image</span>
          </div>
          <div class="inventory-card-body">
            <h3>${escapeHtml(item.item)}</h3>
            ${item.specification ? `<p class="inventory-card-spec">&#128230; ${escapeHtml(item.specification)}</p>` : ''}
            ${item.code ? `<p class="inventory-card-code">Code: ${escapeHtml(item.code)}</p>` : ''}
            <div class="inventory-card-footer">
              <button class="inventory-view-more" type="button" data-item-index="${index}" aria-label="View more about ${escapeHtml(item.item)}">View More &#8594;</button>
            </div>
          </div>
        </article>`;
    }).join('');

    emptyMessage.hidden = visibleItems.length > 0;
    pagination.classList.toggle('hidden', visibleItems.length <= pageSize);
    categoryHeading.hidden = !activeCategory;
    if (activeCategory) categoryHeading.textContent = activeCategory.label;
    const firstPage = Math.max(1, Math.min(currentPage - 2, pageCount - 5));
    const lastPage = Math.min(pageCount, firstPage + 5);
    let buttons = `<button class="page-btn" type="button" data-page="${currentPage - 1}"${currentPage === 1 ? ' disabled' : ''}>&#8249; Prev</button>`;
    for (let page = firstPage; page <= lastPage; page++) {
      const active = page === currentPage;
      buttons += `<button class="page-btn${active ? ' active' : ''}" type="button" data-page="${page}" aria-label="Page ${page}"${active ? ' aria-current="page"' : ''}>${page}</button>`;
    }
    buttons += `<button class="page-btn" type="button" data-page="${currentPage + 1}"${currentPage === pageCount ? ' disabled' : ''}>Next &#8250;</button>`;
    pagination.innerHTML = buttons;
  }

  pagination.addEventListener('click', event => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    const targetPage = Number(button.dataset.page);
    const visibleItems = activeCategory
      ? items.filter(item => getCategory(item) === activeCategory.id)
      : items;
    const pageCount = Math.ceil(visibleItems.length / pageSize);
    if (targetPage >= 1 && targetPage <= pageCount) {
      currentPage = targetPage;
      render();
    }
  });

  function showMedia(index) {
    const media = activeMediaItems[index];
    if (!media) return;
    if (media.type === 'video') {
      detailPreview.innerHTML = `<video controls playsinline aria-label="Video for ${escapeHtml(media.name)}" src="${escapeHtml(media.src)}"></video>`;
    } else {
      detailPreview.innerHTML = `<img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.name)} photo ${index + 1}" />`;
    }
    detailPreview.hidden = false;
    mediaList.querySelectorAll('.inventory-media-choice').forEach((button, buttonIndex) => {
      button.setAttribute('aria-pressed', String(buttonIndex === index));
    });
  }

  function openDetails(item) {
    const mediaEntry = itemMedia[item.sn] || item;
    const uses = Array.isArray(mediaEntry.uses) ? mediaEntry.uses.filter(Boolean) : [];
    const photos = Array.isArray(mediaEntry.images) ? mediaEntry.images.filter(Boolean) : [];
    const video = typeof mediaEntry.video === 'string' ? mediaEntry.video.trim() : '';
    activeMediaItems = [
      ...photos.map((src, index) => ({ type: 'image', src, name: item.item, label: `Photo ${index + 1}` })),
      ...(video ? [{ type: 'video', src: video, name: item.item, label: 'Video' }] : [])
    ];

    const category = categoryRules.find(rule => rule.id === getCategory(item));
    document.getElementById('inventoryDetailCategory').textContent =
      mediaEntry.category || (category ? category.label : 'Other Products');
    document.getElementById('inventoryDetailName').textContent = item.item;
    document.getElementById('inventoryDetailSubtitle').textContent = mediaEntry.sizes
      ? `Available sizes: ${mediaEntry.sizes}`
      : item.specification
        ? `Specification: ${item.specification}`
        : item.piecesPerCarton
          ? `Packaging: ${item.piecesPerCarton} per carton`
          : 'Product details will be added.';
    document.getElementById('inventoryDetailAbout').textContent = mediaEntry.description
      || item.specification
      || 'Product information will be added.';
    document.getElementById('inventoryDetailUses').innerHTML = (uses.length
      ? uses
      : ['Usage information will be added.'])
      .map(use => `<li>${escapeHtml(use)}</li>`)
      .join('');
    document.getElementById('inventoryDetailNews').innerHTML =
      `<strong>Latest:</strong>${escapeHtml(mediaEntry.news || 'Product news will be added.')}`;

    mediaList.innerHTML = activeMediaItems.length
      ? activeMediaItems.map((media, index) => media.type === 'video'
        ? `<button class="inventory-media-choice inventory-media-choice-video" type="button" data-media-index="${index}" aria-label="Play video for ${escapeHtml(item.item)}" aria-pressed="false"><span aria-hidden="true">&#9654;</span><span>Video</span></button>`
        : `<button class="inventory-media-choice" type="button" data-media-index="${index}" aria-label="View photo ${index + 1} of ${escapeHtml(item.item)}" aria-pressed="false"><img src="${escapeHtml(media.src)}" alt="" /><span class="inventory-media-placeholder" hidden>&#128230;</span></button>`
      ).join('')
      : '<div class="inventory-media-placeholder">Product photos and video will be added here.</div>';
    mediaList.querySelectorAll('.inventory-media-choice img').forEach(image => {
      image.addEventListener('error', () => {
        image.hidden = true;
        image.nextElementSibling.hidden = false;
      }, { once: true });
    });
    detailPreview.innerHTML = '';
    detailPreview.hidden = true;

    detailOverlay.classList.add('open');
    detailOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('inventoryDetailClose').focus();
  }

  function closeDetails() {
    detailOverlay.classList.remove('open');
    detailOverlay.setAttribute('aria-hidden', 'true');
    detailPreview.querySelectorAll('video').forEach(videoElement => videoElement.pause());
    detailPreview.innerHTML = '';
    detailPreview.hidden = true;
    document.body.style.overflow = '';
  }

  cards.addEventListener('click', event => {
    const button = event.target.closest('[data-item-index]');
    if (!button) return;
    const item = items[Number(button.dataset.itemIndex)];
    if (item) openDetails(item);
  });
  mediaList.addEventListener('click', event => {
    const button = event.target.closest('[data-media-index]');
    if (button) showMedia(Number(button.dataset.mediaIndex));
  });
  document.getElementById('inventoryDetailClose').addEventListener('click', closeDetails);
  detailOverlay.addEventListener('click', event => {
    if (event.target === detailOverlay) closeDetails();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && detailOverlay.classList.contains('open')) closeDetails();
  });

  render();
})();
