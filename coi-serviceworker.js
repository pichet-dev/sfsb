// coi-serviceworker.js
// Cross-Origin Isolation Service Worker

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin === self.origin) {
    const headers = new Headers(event.request.headers);
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Embedder-Policy", "require-corp");

    event.respondWith(
      fetch(event.request, { headers })
        .then((response) => {
          const newHeaders = new Headers(response.headers);
          newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
          newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        })
    );
  }
});