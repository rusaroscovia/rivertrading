(function () {
  const sourceProducts = window.RIVER_SAFETY_PRODUCTS.filter(product => !product.sourceNumber.startsWith('FE-'));
  const existingProducts = [
    {
      id: 'handtool-existing-1',
      sourceNumber: 'Existing Hand Tools catalogue',
      name: 'Barbed Wire',
      description: 'Per Roll (100m)',
      pcsPerCarton: '',
      additionalInformation: 'Heavy-gauge galvanised barbed wire for perimeter security, livestock fencing, and crop protection. Rust-resistant coating ensures long service life outdoors. Uses: security perimeter fencing; livestock containment and management; crop and garden protection; residence boundary fencing; industrial compound security. Product news: available in standard (12.5G) and heavy-duty (11G) gauges.'
    },
    {
      id: 'handtool-existing-2',
      sourceNumber: 'Existing Hand Tools catalogue',
      name: 'Caster Wheels (Swivel)',
      description: '40mm / 50mm / 75mm',
      pcsPerCarton: '',
      additionalInformation: 'Swivel caster wheels in multiple sizes for furniture, equipment, and carts to allow easy rolling movement. Uses: trolleys and serving carts; office furniture and chairs; workshop equipment; medical and hospital trolleys; retail display units. Product news: heavy-duty casters with brake lock mechanism are available.'
    },
    {
      id: 'handtool-existing-3',
      sourceNumber: 'Existing Hand Tools catalogue',
      name: 'Glass Cutter',
      description: 'Standard / Heavy Duty',
      pcsPerCarton: '',
      additionalInformation: 'Diamond-tipped glass scoring tool for cutting glass panels cleanly along a scored line. The hardened diamond tip scores without cracking. Uses: cutting window and door glass panes; mirror cutting and shaping; stained glass work; replacing broken glass panels. Product news: heavy-duty version with tungsten carbide wheel lasts three times longer.'
    },
    {
      id: 'handtool-existing-4',
      sourceNumber: 'Existing Hand Tools catalogue',
      name: 'Iranda (Wood Planer)',
      description: 'Block / Bench',
      pcsPerCarton: '',
      additionalInformation: 'Manual wood planer used by carpenters and woodworkers to smooth, flatten, and shape wooden surfaces and edges. Uses: smoothing rough-sawn timber; flattening warped boards; chamfering and bevelling wood edges; fitting doors and window frames. Product news: bench planer version available for wider-surface planing.'
    },
    {
      id: 'handtool-existing-5',
      sourceNumber: 'Existing Hand Tools catalogue',
      name: 'Magnetic Spirit Level',
      description: '30cm / 60cm / 100cm',
      pcsPerCarton: '',
      additionalInformation: 'Precision magnetic spirit level for checking horizontal and vertical alignment during construction, tiling, and carpentry. Uses: checking wall and floor levelness; door and window frame installation; tile and paving alignment; shelf and bracket installation. Product news: all sizes feature dual-bubble vials.'
    },
    {
      id: 'handtool-existing-6',
      sourceNumber: 'Existing Hand Tools catalogue',
      name: 'Pneumatic Nail Gun',
      description: '18G / 16G',
      pcsPerCarton: '',
      additionalInformation: 'Air-powered nail gun for fast, precise fastening of nails into wood. Powered by a compressed air compressor. Uses: timber frame construction; hardwood flooring installation; roofing and decking; cabinet and furniture making. Product news: sold with a starter pack of 500 nails.'
    },
    {
      id: 'handtool-existing-7',
      sourceNumber: 'Existing Hand Tools catalogue',
      name: 'Tenayi (Wire Plier)',
      description: 'Standard',
      pcsPerCarton: '',
      additionalInformation: 'Specialty plier tool for electricians and craftsmen that bends, cuts, and pulls wires through conduit, wood, and other materials. Uses: pulling electrical cables through conduit; bending and shaping wire for installations; removing nails and staples from timber; threading wires through tight spaces. Product news: rubber-grip handle for improved comfort and safety.'
    }
  ];

  window.RIVER_PRODUCT_CATALOG_CONFIG = {
    products: [...sourceProducts, ...existingProducts],
    categoryLabel: 'Hand Tools',
    heading: 'Hand Tools',
    detailsLabel: 'Hand Tools',
    introText: 'Browse the supplied Safety & Protection product list alongside the existing Hand Tools catalogue.'
  };
})();
