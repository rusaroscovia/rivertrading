# Event videos

Put event videos in the matching event folder, for example:

`videos/events/trade-fair-highlights/highlights.mp4`

Then add an entry to that event's `media` array in `js/event-media-data.js`:

```js
{ type: 'video', src: '../videos/events/trade-fair-highlights/highlights.mp4', alt: 'Trade fair highlights' }
```

The paths in the data file are relative to `pages/events.html`. Use MP4 or WebM formats.
