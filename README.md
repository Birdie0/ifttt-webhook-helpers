# ifttt-webhook-helpers

* `POST /api/resolve-tco-links` - resolve all t.co links in string
  * body: `{"text": "sample text https://t.co/1234567890"}`
  * response `{"text": "sample text https://example.com"}`

* `POST /api/resolve-links` - resolve all links with selected domains in string
  * body: `{"text": "sample text https://t.co/1234567890 https://google.com", "domains": ["t.co", "bit.ly"]}`
  * response `{"text": "sample text https://example.com https://google.com"}`
