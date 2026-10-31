










(function () {
  'use strict';



  var base = 'images/welcomeimages-optimized/';
  if (document.currentScript && document.currentScript.src) {
    try {
      base = new URL('../images/welcomeimages-optimized/', document.currentScript.src).href;
    } catch (e) {

    }
  }



  var FILES = [
    { file: 'AIR-NAIL-GUN-kinya-b.jpg',                alt: 'Air nail gun' },
    { file: 'AMAVUTA-YIMASHINI-B.jpg',                 alt: 'RIVER® machine lubricating oil' },
    { file: 'ARRIVAGE-TOOLBOX-1-EN_web 1000x550.jpg',  alt: 'Assorted toolboxes' },
    { file: 'CAR-SHAMPOO-kinya-B.jpg',                 alt: 'Car shampoo' },
    { file: 'CASTERS-WHITE-BRAKE-b.jpg',               alt: 'Casters with white brake' },
    { file: 'CONTACT-ADHESIVE-b.jpg',                  alt: 'Contact adhesive' },
    { file: 'CONTACT-ADHESIVE-kinya-b.jpg',            alt: 'Contact adhesive' },
    { file: 'DOG-SHAMPOO-B-kinya.jpg',                 alt: 'Dog shampoo' },
    { file: 'ELECTRICIAN TOOL KIT-KN CM_web.jpg',      alt: 'Electrician tool kit' },
    { file: 'ELECTRICIAN TOOL KITCM_web.jpg',          alt: 'Electrician tool kit' },
    { file: 'EXTENSION-PLUG-b.jpg',                    alt: 'Extension plug' },
    { file: 'FIRE-ALARM-CONTROL-PANEL-kinya-b.jpg',    alt: 'Fire alarm control panel' },
    { file: 'FIRE-FIGHTER-BOOT-b.jpg',                 alt: 'Firefighter boots' },
    { file: 'GLASS-CLEANER-kinya-B.jpg',               alt: 'Glass cleaner' },
    { file: 'GLASS-CUTTING-TOOLS-kinya-b.jpg',         alt: 'Glass cutting tools' },
    { file: 'IRON-JACK-PLANE-b.jpg',                   alt: 'Iron jack plane' },
    { file: 'IRON-JACK-PLANE-kinya-b.jpg',             alt: 'Iron jack plane' },
    { file: 'MAGNETIC SPIRIT LEVEL kinyaCM_web.jpg',   alt: 'Magnetic spirit level' },
    { file: 'MAGNETIC SPIRIT LEVELCM_web.jpg',         alt: 'Magnetic spirit level' },
    { file: 'Post-MSTP-Weldings-helmet-22.03.25-CM-kinya-b.jpg', alt: 'Welding helmet' },
    { file: 'Post-MSTP-leather-gloves-22.03.25-CM-kinya-b.jpg',  alt: 'Leather work gloves' },
    { file: 'RAINCOAT-b.jpg',                          alt: 'Raincoat' },
    { file: 'SAFETY-HELMET-b.jpg',                     alt: 'Safety helmet' },
    { file: 'TOWER-PINCER-PLIER-kinya-b.jpg',          alt: 'Tower pincer plier' },
    { file: 'TOWER-PINCER-b.jpg',                      alt: 'Tower pincer' },
    { file: 'post-all-socialmedia-Torsade1-EN_web 1000x550.jpg', alt: 'River Trading product range' }
  ];

  window.RIVER_PHOTOS = FILES.map(function (p) {
    return { src: base + encodeURI(p.file), alt: p.alt };
  });
})();
