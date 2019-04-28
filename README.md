# inline-moodle-pdf-extension

Chrome extension which makes the University of Helsinki Moodle show PDF downloads in a new tab instead of downloading them.

[**View on Chrome Web Store →**](https://chrome.google.com/webstore/detail/inline-pdfs-for-uh-moodle/ilddijpognoadbfmlgnkgdogdciogmjn)

Works by rewriting `Content-Disposition: attachment` into `Content-Disposition: inline` in PDF web requests. See [`./background.js`](https://github.com/cxcorp/inline-moodle-pdf-extension/blob/master/background.js) for details.

## License

MIT License, see LICENSE.
