import { timestamp, files, shell, routes } from '@sapper/service-worker';

const ASSETS = `cache${timestamp}`;

// `shell` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = shell.concat(files);
const cached = new Set(to_cache);

const urlB64ToUint8Array = base64String => {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
	  .replace(/\-/g, "+")
	  .replace(/_/g, "/");
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
	  outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};

const saveSubscription = async (subscription,data) => {
	const SERVER_URL = "https://newapp.nl/api/save-subscription";
	const response = await fetch(SERVER_URL, {
	  method: "post",
	  headers: {
		"Content-Type": "application/json"
	  },
	  body: JSON.stringify({user:data, sub_info:subscription})
	});
	return response.json();
};

self.addEventListener('message', async event => {
	if (Notification.permission === "granted"){
		try {
			const applicationServerKey = urlB64ToUint8Array(
			"BGfsb_G1tXj-jSN8h-9spz2znzfm1sib-Xx42FLmN8p7xQwv8C_ke_-77DFKkBiv843msSFlvQw0PDr2--mpJmw"
			);
			const options = { applicationServerKey, userVisibleOnly: true };
			const subscription = await self.registration.pushManager.subscribe(options);
			const response = await saveSubscription(subscription,event.data);
		} catch (err) {
			console.log("Error", err);
		}
	}
});

self.addEventListener('install', async event => {
	event.waitUntil(
		caches
			.open(ASSETS)
			.then(cache => cache.addAll(to_cache))
			.then(() => {
				self.skipWaiting();
			})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(async keys => {
			// delete old caches
			for (const key of keys) {
				if (key !== ASSETS) await caches.delete(key);
			}

			self.clients.claim();
		})
	);
});

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

	const url = new URL(event.request.url);

	// don't try to handle e.g. data: URIs
	if (!url.protocol.startsWith('http')) return;

	// ignore dev server requests
	if (url.hostname === self.location.hostname && url.port !== self.location.port) return;

	// always serve static files and bundler-generated assets from cache
	if (url.host === self.location.host && cached.has(url.pathname)) {
		event.respondWith(caches.match(event.request));
		return;
	}

	// for pages, you might want to serve a shell `service-worker-index.html` file,
	// which Sapper has generated for you. It's not right for every
	// app, but if it's right for yours then uncomment this section
	/*
	if (url.origin === self.origin && routes.find(route => route.pattern.test(url.pathname))) {
		event.respondWith(caches.match('/service-worker-index.html'));
		return;
	}
	*/

	if (event.request.cache === 'only-if-cached') return;

	// for everything else, try the network first, falling back to
	// cache if the user is offline. (If the pages never change, you
	// might prefer a cache-first approach to a network-first one.)
	event.respondWith(
		caches
			.open(`offline${timestamp}`)
			.then(async cache => {
				try {
					const response = await fetch(event.request);
					cache.put(event.request, response.clone());
					return response;
				} catch(err) {
					const response = await cache.match(event.request);
					if (response) return response;

					throw err;
				}
			})
	);
});

self.addEventListener('push', function(e) {
	var options = {
	  body: 'This notification was generated from a push!',
	  icon: 'logo-192.png',
	  vibrate: [100, 50, 100],
	  data: {
		dateOfArrival: Date.now(),
		primaryKey: '2'
	  }
	};
	e.waitUntil(
	  self.registration.showNotification(e.data.text(), options)
	);
  });
