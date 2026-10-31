


(function () {
  function ready(cb) {
    if (document.readyState !== 'loading') cb();
    else document.addEventListener('DOMContentLoaded', cb);
  }

  function svgURI(name, kind) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="320">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#173F8A"/><stop offset="1" stop-color="#D71920"/>' +
      '</linearGradient></defs><rect width="420" height="320" fill="url(#g)"/>' +
      '<text x="210" y="150" font-size="92" text-anchor="middle">&#128230;</text>' +
      '<rect x="0" y="250" width="420" height="70" fill="rgba(0,0,0,0.35)"/>' +
      '<text x="210" y="293" font-size="20" fill="#fff" font-family="Arial,Helvetica,sans-serif" text-anchor="middle">' +
      name + ' &#8212; ' + kind + '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(s);
  }

  function galleryFor(p) {
    if (p.gallery && p.gallery.length) return p.gallery;
    return [
      (p.image && p.image.indexOf('placeholder') === -1) ? p.image : svgURI(p.name, 'front'),
      svgURI(p.name, 'detail'),
      svgURI(p.name, 'in use')
    ];
  }

  ready(function () {
    var modal = document.getElementById('productModal');
    if (!modal || typeof window.openModal !== 'function') return;


    var css = document.createElement('style');
    css.textContent =
      '.modal-media{position:relative;background:#000;border-radius:12px 12px 0 0;overflow:hidden;}' +
      '.modal-main{width:100%;height:300px;object-fit:cover;display:block;background:#111;}' +
      '.modal-video-wrap{width:100%;height:300px;display:none;background:#000;position:relative;}' +
      '.modal-video-wrap video{width:100%;height:100%;object-fit:contain;background:#000;}' +
      '.video-note{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;font-size:.82rem;padding:20px;background:#111;}' +
      '.video-note .play{font-size:2.6rem;margin-bottom:8px;}' +
      '.modal-thumbs{display:flex;gap:8px;padding:10px;background:#f3f4f6;overflow-x:auto;}' +
      '.modal-thumb{flex:0 0 auto;width:70px;height:52px;border-radius:6px;overflow:hidden;border:2px solid transparent;cursor:pointer;background:#ddd;}' +
      '.modal-thumb.active{border-color:#D71920;}' +
      '.modal-thumb img{width:100%;height:100%;object-fit:cover;}' +
      '.modal-thumb.vt{display:flex;align-items:center;justify-content:center;background:#111;color:#fff;font-size:.62rem;font-weight:800;flex-direction:column;line-height:1.1;}' +
      '@media(max-width:768px){.modal-main,.modal-video-wrap{height:200px;}}';
    document.head.appendChild(css);



    var oldImg = modal.querySelector('.modal-img');
    if (!oldImg) return;
    oldImg.style.display = 'none';
    var media = document.createElement('div');
    media.className = 'modal-media';
    media.innerHTML =
      '<img class="modal-main" id="modalMain" src="" alt=""/>' +
      '<div class="modal-video-wrap" id="modalVideoWrap">' +
      '<video id="modalVideo" controls playsinline preload="none"></video>' +
      '<div class="video-note" id="videoNote"><span class="play">&#9654;</span><span>10-second product video</span>' +
      '<span style="opacity:.7;margin-top:6px">Add file at videos/&lt;product-id&gt;.mp4</span></div></div>';
    oldImg.insertAdjacentElement('afterend', media);
    var thumbs = document.createElement('div');
    thumbs.className = 'modal-thumbs';
    thumbs.id = 'modalThumbs';
    media.insertAdjacentElement('afterend', thumbs);

    var mMain = document.getElementById('modalMain');
    var mVWrap = document.getElementById('modalVideoWrap');
    var mVid = document.getElementById('modalVideo');
    var cur = null, idx = 0;



    function guard(img, fallback) {
      img.onerror = function () {
        img.onerror = null;
        if (img.src.indexOf('data:image/svg+xml') !== 0) img.src = fallback;
      };
    }

    function selectImage(i) {
      idx = i;
      mVWrap.style.display = 'none';
      mMain.style.display = '';
      mMain.src = cur.gallery[i];
      guard(mMain, svgURI(cur.name, 'front'));
      [].forEach.call(thumbs.children, function (t) { t.classList.remove('active'); });
      if (thumbs.children[i]) thumbs.children[i].classList.add('active');
    }
    function selectVideo() {
      mMain.style.display = 'none';
      mVWrap.style.display = 'block';
      [].forEach.call(thumbs.children, function (t) { t.classList.remove('active'); });
      var vt = [].slice.call(thumbs.children).filter(function (t) { return t.dataset.v === '1'; })[0];
      if (vt) vt.classList.add('active');
      var note = document.getElementById('videoNote');
      note.style.display = 'flex';
      mVid.oncanplay = function () { note.style.display = 'none'; };
      mVid.onerror = function () { note.style.display = 'flex'; };
      mVid.src = cur.video;
      mVid.load();
      mVid.play().catch(function () {});
    }
    thumbs.addEventListener('click', function (e) {
      var t = e.target.closest('.modal-thumb');
      if (!t || !cur) return;
      if (t.dataset.v === '1') selectVideo();
      else selectImage(parseInt(t.dataset.i, 10));
    });


    var origOpen = window.openModal;
    window.openModal = function (id) {
      origOpen.call(this, id);
      var p = null;
      try { p = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(function (x) { return x.id === id; }) : null; } catch (e) {}
      if (!p) return;
      cur = p;
      cur.gallery = galleryFor(p);
      cur.video = '../videos/' + p.id + '.mp4';
      thumbs.innerHTML = cur.gallery.map(function (g, i) {
        return '<div class="modal-thumb' + (i === 0 ? ' active' : '') + '" data-i="' + i + '"><img src="' + g + '" alt="' + p.name + ' photo ' + (i + 1) + '"/></div>';
      }).join('') + '<div class="modal-thumb vt" data-v="1"><span>&#9654;</span>10s</div>';
      [].forEach.call(thumbs.querySelectorAll('img'), function (im, i) {
        guard(im, svgURI(p.name, i === 0 ? 'front' : (i === 1 ? 'detail' : 'in use')));
      });
      selectImage(0);
    };


    var origClose = window.closeModal;
    if (typeof origClose === 'function') {
      window.closeModal = function () {
        origClose.call(this);
        try { mVid.pause(); mVid.src = ''; } catch (e) {}
      };
    }
  });
})();
