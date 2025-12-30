if (!self.define) {
	let e,
		s = {};
	const i = (i, a) => (
		(i = new URL(i + ".js", a).href),
		s[i] ||
			new Promise((s) => {
				if ("document" in self) {
					const e = document.createElement("script");
					(e.src = i), (e.onload = s), document.head.appendChild(e);
				} else (e = i), importScripts(i), s();
			}).then(() => {
				const e = s[i];
				if (!e) throw new Error(`Module ${i} didn’t register its module`);
				return e;
			})
	);
	self.define = (a, c) => {
		const n =
			e ||
			("document" in self ? document.currentScript.src : "") ||
			location.href;
		if (s[n]) return;
		const u = {};
		const t = (e) => i(e, n),
			r = { module: { uri: n }, exports: u, require: t };
		s[n] = Promise.all(a.map((e) => r[e] || t(e))).then((e) => (c(...e), u));
	};
}
define(["./workbox-ee5ddb69"], (e) => {
	importScripts(),
		self.skipWaiting(),
		e.clientsClaim(),
		e.precacheAndRoute(
			[
				{
					url: "/_next/app-build-manifest.json",
					revision: "1a42f30fdc9b14cbe3d0f1d1663acfc7",
				},
				{
					url: "/_next/static/chunks/08e6287a-5e902165c175b5e5.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/332-1a6ccf6bd3c6a094.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/357-16ccaffd7ecc6dc5.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/654-393a19ff92c1a127.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/675-e99998e5fc24eccd.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/723-c044c8a897a39aef.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/765-f1d53e2d9fe193f7.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/773-4d7f58431029639e.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/_not-found/page-cc6ebcc5826e6e2e.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/api/airbear/location/route-34627e9919e501b9.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/api/auth/callback/route-8715e047ffed1960.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/api/health/route-ea768b5e3ac75cd1.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/api/stripe/checkout/route-5b0461467106c86b.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/api/stripe/create-payment-intent/route-df56c4c4083919c4.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/api/stripe/webhook/route-978c479fc09b0ab2.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/auth/login/page-4706d76ad3a43f06.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/auth/signup/page-9a3e186e4808e82b.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/layout-4361d00f04b7bab2.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/map/page-48bb7167bcc4f89a.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/not-found-68711ec2445909cb.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/page-7e2719dc5c4ac3c6.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/app/products/page-4e7f868054260612.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/ed48eaa7.391fce1807eb0f5b.js",
					revision: "391fce1807eb0f5b",
				},
				{
					url: "/_next/static/chunks/framework-f2c8decfbee2f232.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/main-28ec30498327f871.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/main-app-3fe158e572f313e4.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/pages/_app-f2e15d7168d096a5.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/pages/_error-328b8c8f9f712f69.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
					revision: "846118c33b2c0e922d7b3a7676f81f6f",
				},
				{
					url: "/_next/static/chunks/webpack-aef3438fb6ebd7d1.js",
					revision: "p8Y4nuYux2FsCxiu60fxj",
				},
				{
					url: "/_next/static/css/35d7ea13da595721.css",
					revision: "35d7ea13da595721",
				},
				{
					url: "/_next/static/css/6a35f18609a6e6ea.css",
					revision: "6a35f18609a6e6ea",
				},
				{
					url: "/_next/static/media/19cfc7226ec3afaa-s.woff2",
					revision: "9dda5cfc9a46f256d0e131bb535e46f8",
				},
				{
					url: "/_next/static/media/21350d82a1f187e9-s.woff2",
					revision: "4e2553027f1d60eff32898367dd4d541",
				},
				{
					url: "/_next/static/media/36966cca54120369-s.p.woff2",
					revision: "25ea4a783c12103f175f5b157b7d96aa",
				},
				{
					url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
					revision: "01ba6c2a184b8cba08b0d57167664d75",
				},
				{
					url: "/_next/static/media/b7387a63dd068245-s.woff2",
					revision: "dea099b7d5a5ea45bd4367f8aeff62ab",
				},
				{
					url: "/_next/static/media/ba9851c3c22cd980-s.woff2",
					revision: "9e494903d6b0ffec1a1e14d34427d44d",
				},
				{
					url: "/_next/static/media/c5fe6dc8356a8c31-s.woff2",
					revision: "027a89e9ab733a145db70f09b8a18b42",
				},
				{
					url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
					revision: "d54db44de5ccb18886ece2fda72bdfe0",
				},
				{
					url: "/_next/static/media/e1aab0933260df4d-s.woff2",
					revision: "207f8e9f3761dbd724063a177d906a99",
				},
				{
					url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
					revision: "65850a373e258f1c897a2b3d75eb74de",
				},
				{
					url: "/_next/static/p8Y4nuYux2FsCxiu60fxj/_buildManifest.js",
					revision: "58550fd7aebf80accf46288bd0b54a04",
				},
				{
					url: "/_next/static/p8Y4nuYux2FsCxiu60fxj/_ssgManifest.js",
					revision: "b6652df95db52feb4daf4eca35380933",
				},
				{
					url: "/airbear-logo.png",
					revision: "26ff293dba97256f12327b0c219a86b0",
				},
				{
					url: "/apple-icon.png",
					revision: "734ce6c878789fcd5843e8a7963e0756",
				},
				{
					url: "/apple-touch-icon.png",
					revision: "734ce6c878789fcd5843e8a7963e0756",
				},
				{
					url: "/icon-192x192.png",
					revision: "abd5ebe9e287ca0a89f4fd3da2b5cf9c",
				},
				{
					url: "/icon-512x512.png",
					revision: "53426c910bcab7d3e5213cc64aa1b2c5",
				},
				{
					url: "/icon-dark-32x32.png",
					revision: "abd5ebe9e287ca0a89f4fd3da2b5cf9c",
				},
				{
					url: "/icon-light-32x32.png",
					revision: "53426c910bcab7d3e5213cc64aa1b2c5",
				},
				{ url: "/icon.svg", revision: "6e5d88c5f7e97d26ac4ad47e703bf9de" },
				{ url: "/manifest.json", revision: "6cabb0e90cf6a12b36ec53c9764261be" },
				{ url: "/og-image.png", revision: "95d8d1a4a9bbcccc875e2c381e74064a" },
				{
					url: "/placeholder-logo.png",
					revision: "95d8d1a4a9bbcccc875e2c381e74064a",
				},
				{
					url: "/placeholder-logo.svg",
					revision: "1e16dc7df824652c5906a2ab44aef78c",
				},
				{
					url: "/placeholder-user.jpg",
					revision: "7ee6562646feae6d6d77e2c72e204591",
				},
				{
					url: "/placeholder.jpg",
					revision: "1e533b7b4545d1d605144ce893afc601",
				},
				{
					url: "/placeholder.svg",
					revision: "35707bd9960ba5281c72af927b79291f",
				},
			],
			{ ignoreURLParametersMatching: [] },
		),
		e.cleanupOutdatedCaches(),
		e.registerRoute(
			"/",
			new e.NetworkFirst({
				cacheName: "start-url",
				plugins: [
					{
						cacheWillUpdate: async ({
							request: e,
							response: s,
							event: i,
							state: a,
						}) =>
							s && "opaqueredirect" === s.type
								? new Response(s.body, {
										status: 200,
										statusText: "OK",
										headers: s.headers,
									})
								: s,
					},
				],
			}),
			"GET",
		),
		e.registerRoute(
			/^https:\/\/airbear\.me\/.*/i,
			new e.NetworkFirst({
				cacheName: "airbear-pages",
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 86400 }),
				],
			}),
			"GET",
		),
		e.registerRoute(
			/^https:\/\/.*\.supabase\.co\/.*/i,
			new e.NetworkFirst({
				cacheName: "supabase-api",
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 3600 }),
				],
			}),
			"GET",
		),
		e.registerRoute(
			/\.(png|jpg|jpeg|svg|gif|webp|avif)$/i,
			new e.CacheFirst({
				cacheName: "images",
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 2592e3 }),
				],
			}),
			"GET",
		);
});
