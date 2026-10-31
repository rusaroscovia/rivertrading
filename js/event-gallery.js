(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var categories = window.RIVER_EVENT_CATEGORIES;
    var categoryRoot = document.getElementById('eventCategories');
    var overlay = document.getElementById('eventGallery');
    var dialog = overlay && overlay.querySelector('[role="dialog"]');
    var title = document.getElementById('eventGalleryTitle');
    var subtitle = document.getElementById('eventGallerySubtitle');
    var description = document.getElementById('eventGalleryDescription');
    var stage = document.getElementById('eventGalleryStage');
    var emptyMessage = document.getElementById('eventGalleryEmpty');
    var thumbnails = document.getElementById('eventGalleryThumbs');
    var closeButton = overlay && overlay.querySelector('[data-close-event-gallery]');

    if (!Array.isArray(categories) || !categoryRoot || !overlay || !dialog || !title || !subtitle || !description || !stage || !emptyMessage || !thumbnails || !closeButton) {
      console.error('Event gallery could not start because its data or page elements are missing.');
      return;
    }

    var eventsById = new Map();
    var activeVideo = null;
    var returnFocus = null;
    var previousBodyOverflow = '';
    var imageViewer = null;
    var imageViewerImage = null;
    var imageViewerTitle = null;
    var imageViewerZoomButton = null;
    var imageViewerOpener = null;

    function makeElement(tag, className, text) {
      var element = document.createElement(tag);
      if (className) element.className = className;
      if (text) element.textContent = text;
      return element;
    }

    function mediaUrl(src) {
      return new URL(src, document.baseURI).href;
    }

    function eventMedia(event) {
      return Array.isArray(event.media) ? event.media : [];
    }

    function eventAwards(event) {
      return Array.isArray(event.awards) ? event.awards : [];
    }

    function createImageViewer() {
      imageViewer = makeElement('dialog', 'award-image-viewer');
      imageViewer.setAttribute('aria-labelledby', 'awardImageViewerTitle');

      var header = makeElement('div', 'award-image-viewer-header');
      imageViewerTitle = makeElement('h2', 'award-image-viewer-title');
      imageViewerTitle.id = 'awardImageViewerTitle';

      var controls = makeElement('div', 'award-image-viewer-controls');
      imageViewerZoomButton = makeElement('button', 'award-image-viewer-control', 'Zoom in');
      imageViewerZoomButton.type = 'button';
      imageViewerZoomButton.setAttribute('aria-pressed', 'false');
      imageViewerZoomButton.addEventListener('click', function () {
        var zoomed = imageViewer.classList.toggle('zoomed');
        imageViewerZoomButton.textContent = zoomed ? 'Zoom out' : 'Zoom in';
        imageViewerZoomButton.setAttribute('aria-pressed', String(zoomed));
      });

      var closeImageViewerButton = makeElement('button', 'award-image-viewer-control award-image-viewer-close', '\u00d7');
      closeImageViewerButton.type = 'button';
      closeImageViewerButton.setAttribute('aria-label', 'Close enlarged award image');
      closeImageViewerButton.addEventListener('click', function () {
        imageViewer.close();
      });
      imageViewer.addEventListener('cancel', function (event) {
        event.preventDefault();
        imageViewer.close();
      });

      var imageStage = makeElement('div', 'award-image-viewer-stage');
      imageViewerImage = document.createElement('img');
      imageStage.appendChild(imageViewerImage);
      controls.appendChild(imageViewerZoomButton);
      controls.appendChild(closeImageViewerButton);
      header.appendChild(imageViewerTitle);
      header.appendChild(controls);
      imageViewer.appendChild(header);
      imageViewer.appendChild(imageStage);
      imageViewer.addEventListener('click', function (event) {
        if (event.target === imageViewer) {
          var bounds = imageViewer.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            imageViewer.close();
          }
        }
      });
      imageViewer.addEventListener('close', function () {
        var opener = imageViewerOpener;
        imageViewer.classList.remove('zoomed');
        imageViewerImage.removeAttribute('src');
        imageViewerZoomButton.textContent = 'Zoom in';
        imageViewerZoomButton.setAttribute('aria-pressed', 'false');
        imageViewerOpener = null;
        window.requestAnimationFrame(function () {
          if (opener && opener.isConnected) opener.focus();
        });
      });
      document.body.appendChild(imageViewer);
    }

    function openImageViewer(src, alt, opener) {
      if (!imageViewer) createImageViewer();
      imageViewerOpener = opener;
      imageViewerTitle.textContent = alt;
      imageViewerImage.alt = alt;
      imageViewerImage.src = mediaUrl(src);
      imageViewer.showModal();
      imageViewerZoomButton.focus();
    }

    function createCover(event) {
      var cover = makeElement('div', 'event-card-cover');
      var imageMedia = eventMedia(event).find(function (media) { return media.type === 'image'; });
      var imageSource = event.cover || (imageMedia && imageMedia.src);

      if (imageSource) {
        var image = document.createElement('img');
        image.src = mediaUrl(imageSource);
        image.alt = event.title;
        image.loading = 'lazy';
        image.addEventListener('error', function () {
          image.remove();
          cover.appendChild(createCoverPlaceholder());
          console.error('Unable to load event cover image:', imageSource);
        }, { once: true });
        cover.appendChild(image);
      } else {
        cover.appendChild(createCoverPlaceholder());
      }

      return cover;
    }

    function createCoverPlaceholder() {
      var placeholder = makeElement('div', 'event-card-cover-placeholder');
      placeholder.appendChild(makeElement('span', '', '\u25a7'));
      placeholder.appendChild(makeElement('span', '', 'Event photos and videos'));
      return placeholder;
    }

    function createCard(event) {
      if (!event || !event.id || !event.title || !event.description) {
        console.error('Skipping an event card with missing required information:', event);
        return null;
      }

      eventsById.set(event.id, event);
      var card = makeElement('article', 'event-card');
      card.appendChild(createCover(event));

      var body = makeElement('div', 'event-card-body');
      body.appendChild(makeElement('h4', '', event.title));
      body.appendChild(makeElement('p', 'event-card-description', event.description));

      var footer = makeElement('div', 'event-card-footer');
      var metadata = makeElement('div', 'event-card-meta');
      if (event.organization) metadata.appendChild(makeElement('div', '', event.organization));
      if (event.date) metadata.appendChild(makeElement('div', '', event.date));

      var viewButton = makeElement('button', 'event-view-button');
      viewButton.type = 'button';
      viewButton.dataset.viewEvent = event.id;
      viewButton.appendChild(document.createTextNode('View Event '));
      viewButton.appendChild(makeElement('span', '', '\u2192'));

      footer.appendChild(metadata);
      footer.appendChild(viewButton);
      body.appendChild(footer);
      card.appendChild(body);
      return card;
    }

    categories.forEach(function (category) {
      if (!category || !category.id || !category.title || !Array.isArray(category.events)) {
        console.error('Skipping an event category with invalid data:', category);
        return;
      }

      category.events.forEach(function (event) {
        var card = createCard(event);
        if (card) categoryRoot.appendChild(card);
      });
    });

    function clearStage() {
      if (activeVideo) {
        activeVideo.pause();
        activeVideo.removeAttribute('src');
        activeVideo.load();
        activeVideo = null;
      }
      stage.replaceChildren();
    }

    function showMedia(event, index) {
      var media = eventMedia(event)[index];
      if (!media || !media.src || (media.type !== 'image' && media.type !== 'video')) {
        console.error('Unable to display invalid event media:', media);
        return;
      }

      clearStage();
      emptyMessage.hidden = true;
      stage.hidden = false;
      thumbnails.querySelectorAll('.event-gallery-thumb').forEach(function (button, buttonIndex) {
        button.classList.toggle('active', buttonIndex === index);
      });

      var element;
      if (media.type === 'video') {
        element = document.createElement('video');
        element.controls = true;
        element.playsInline = true;
        element.preload = 'metadata';
        activeVideo = element;
      } else {
        element = document.createElement('img');
        element.alt = media.alt || event.title;
      }

      element.src = mediaUrl(media.src);
      element.addEventListener('error', function () {
        var message = makeElement('p', 'event-gallery-empty', 'This media file could not be loaded: ' + media.src);
        clearStage();
        stage.hidden = true;
        emptyMessage.replaceWith(message);
        emptyMessage = message;
        console.error('Unable to load event media:', media.src);
      }, { once: true });
      stage.appendChild(element);
    }

    function openGallery(event, opener) {
      returnFocus = opener;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.dataset.eventId = event.id;
      title.textContent = event.title;
      subtitle.textContent = [event.organization, event.date].filter(Boolean).join(' · ');
      description.textContent = event.details || '';
      description.hidden = !event.details;
      clearStage();
      thumbnails.replaceChildren();

      var awards = eventAwards(event);
      if (awards.length) {
        dialog.classList.add('event-gallery-dialog-awards');
        title.textContent = event.awardsHeading || 'Our Awards & Recognition';
        subtitle.textContent = '';
        subtitle.hidden = true;
        subtitle.setAttribute('aria-hidden', 'true');
        description.hidden = true;
        stage.hidden = true;
        emptyMessage.hidden = true;
        thumbnails.hidden = false;
        thumbnails.classList.add('event-gallery-awards');
        thumbnails.setAttribute('aria-label', 'Awards and certificates');
        awards.forEach(function (award, index) {
          if (!award || !award.title || !award.description) {
            console.error('Skipping an award placeholder with missing title:', award);
            return;
          }

          var card = makeElement('article', 'event-award-card');
          var image = makeElement('div', 'event-award-image');
          if (award.image) {
            var imageButton = makeElement('button', 'event-award-image-button');
            imageButton.type = 'button';
            imageButton.dataset.awardImage = award.image;
            imageButton.dataset.awardTitle = award.title;
            imageButton.setAttribute('aria-label', 'View larger image: ' + award.title);
            var awardImage = document.createElement('img');
            awardImage.src = mediaUrl(award.image);
            awardImage.alt = award.title;
            awardImage.loading = 'eager';
            awardImage.addEventListener('error', function () {
              imageButton.replaceWith(makeElement('div', 'event-award-placeholder', 'Award image unavailable'));
              console.error('Unable to load award image:', award.image);
            }, { once: true });
            imageButton.appendChild(awardImage);
            image.appendChild(imageButton);
          } else {
            image.appendChild(makeElement('div', 'event-award-placeholder', 'Award image coming soon'));
          }

          var awardCopy = makeElement('div', 'event-award-copy');
          awardCopy.appendChild(makeElement('h3', 'event-award-title', award.title));
          awardCopy.appendChild(makeElement('p', 'event-award-description', award.description));
          card.appendChild(image);
          card.appendChild(awardCopy);
          thumbnails.appendChild(card);
        });

        overlay.hidden = false;
        closeButton.focus();
        return;
      }

      dialog.classList.remove('event-gallery-dialog-awards');
      subtitle.hidden = false;
      subtitle.removeAttribute('aria-hidden');
      subtitle.textContent = [event.organization, event.date].filter(Boolean).join(' · ');
      thumbnails.classList.remove('event-gallery-awards');
      thumbnails.setAttribute('aria-label', 'Event photos and videos');
      var media = eventMedia(event);
      if (!media.length) {
        stage.hidden = true;
        emptyMessage.hidden = false;
        emptyMessage.textContent = 'Photos and videos for this event have not been added yet.';
        thumbnails.hidden = true;
      } else {
        stage.hidden = false;
        emptyMessage.hidden = true;
        thumbnails.hidden = false;
        media.forEach(function (item, index) {
          if (!item || !item.src || (item.type !== 'image' && item.type !== 'video')) {
            console.error('Skipping invalid event media entry:', item);
            return;
          }

          var button = makeElement('button', 'event-gallery-thumb' + (index === 0 ? ' active' : '') + (item.type === 'video' ? ' video' : ''));
          button.type = 'button';
          button.setAttribute('aria-label', (item.type === 'video' ? 'Play video ' : 'View photo ') + (index + 1));
          button.dataset.mediaIndex = String(index);

          if (item.type === 'image') {
            var thumbnail = document.createElement('img');
            thumbnail.src = mediaUrl(item.src);
            thumbnail.alt = item.alt || event.title;
            thumbnail.loading = 'lazy';
            thumbnail.addEventListener('error', function () {
              thumbnail.remove();
              button.classList.add('video');
              button.textContent = '\u25a7';
              console.error('Unable to load event thumbnail:', item.src);
            }, { once: true });
            button.appendChild(thumbnail);
          } else {
            button.textContent = '\u25b6';
          }
          thumbnails.appendChild(button);
        });

        if (thumbnails.children.length) showMedia(event, Number(thumbnails.firstElementChild.dataset.mediaIndex));
      }

      overlay.hidden = false;
      closeButton.focus();
    }

    function closeGallery() {
      if (overlay.hidden) return;
      clearStage();
      dialog.classList.remove('event-gallery-dialog-awards');
      thumbnails.classList.remove('event-gallery-awards');
      overlay.hidden = true;
      document.body.style.overflow = previousBodyOverflow;
      if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    }

    categoryRoot.addEventListener('click', function (event) {
      var button = event.target.closest('[data-view-event]');
      if (!button) return;
      var selectedEvent = eventsById.get(button.dataset.viewEvent);
      if (!selectedEvent) {
        console.error('No event data found for gallery:', button.dataset.viewEvent);
        return;
      }
      openGallery(selectedEvent, button);
    });

    thumbnails.addEventListener('click', function (event) {
      var awardImageButton = event.target.closest('[data-award-image]');
      if (awardImageButton) {
        openImageViewer(awardImageButton.dataset.awardImage, awardImageButton.dataset.awardTitle, awardImageButton);
        return;
      }

      var button = event.target.closest('[data-media-index]');
      if (!button) return;
      var selectedEvent = eventsById.get(dialog.dataset.eventId);
      if (selectedEvent) showMedia(selectedEvent, Number(button.dataset.mediaIndex));
    });

    closeButton.addEventListener('click', closeGallery);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeGallery();
    });
    document.addEventListener('keydown', function (event) {
      if (overlay.hidden) return;
      if (imageViewer && imageViewer.open) {
        if (event.key === 'Escape') {
          event.preventDefault();
          imageViewer.close();
        }
        return;
      }
      if (event.key === 'Escape') {
        closeGallery();
        return;
      }
      if (event.key === 'Tab') {
        var focusable = Array.prototype.slice.call(dialog.querySelectorAll('button:not(:disabled)'));
        if (!focusable.length) {
          event.preventDefault();
          closeButton.focus();
          return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  });
})();
