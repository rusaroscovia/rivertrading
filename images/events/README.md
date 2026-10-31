# Event photos

Put event photos in the matching event folder, for example:

`images/events/trade-fair-highlights/photo-1.jpg`

Then add an entry to that event's `media` array in `js/event-media-data.js`:

```js
{ type: 'image', src: '../images/events/trade-fair-highlights/photo-1.jpg', alt: 'River Trading Ltd at the trade fair' }
```

The paths in the data file are relative to `pages/events.html`. Use supported image formats such as JPG, PNG, or WebP.

## Achievement awards

The Achievements event has six award placeholders. Add each certificate or award image under `images/events/`, then set the matching `image` path and `title` in the `awards` array for `company-achievements` in `js/event-media-data.js`:

```js
{ image: '../images/events/achievements/award-1.jpg', title: 'Award name' }
```

The image paths are relative to `pages/events.html`. Leave `image` empty until the image is added; the placeholder will show a neutral background without an icon.
