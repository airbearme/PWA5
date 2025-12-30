if (!self.define) {
	let e,
		a = {};
	const c = (c, s) => (
		(c = new URL(c + ".js", s).href),
		a[c] ||
			new Promise((a) => {
				if ("document" in self) {
					const e = document.createElement("script");
					(e.src = c), (e.onload = a), document.head.appendChild(e);
				} else (e = c), importScripts(c), a();
			}).then(() => {
				const e = a[c];
				if (!e) throw new Error(`Module ${c} didn’t register its module`);
				return e;
			})
	);
	self.define = (s, i) => {
		const n =
			e ||
			("document" in self ? document.currentScript.src : "") ||
			location.href;
		if (a[n]) return;
		const t = {};
		const r = (e) => c(e, n),
			d = { module: { uri: n }, exports: t, require: r };
		a[n] = Promise.all(s.map((e) => d[e] || r(e))).then((e) => (i(...e), t));
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
					revision: "8306e3c92a60b7cba2720d5ee230f9db",
				},
				{
					url: "/_next/static/KuSIGH4tmb-RcdsKv9Yry/_buildManifest.js",
					revision: "f4e003de2953caf1424bf7108f768c5f",
				},
				{
					url: "/_next/static/KuSIGH4tmb-RcdsKv9Yry/_ssgManifest.js",
					revision: "b6652df95db52feb4daf4eca35380933",
				},
				{
					url: "/_next/static/chunks/266-64e30d6c2e129c1a.js",
					revision: "64e30d6c2e129c1a",
				},
				{
					url: "/_next/static/chunks/369-879ec4640105eaa4.js",
					revision: "879ec4640105eaa4",
				},
				{
					url: "/_next/static/chunks/438.986e15b279dd35bc.js",
					revision: "986e15b279dd35bc",
				},
				{
					url: "/_next/static/chunks/484-59baa0ce862c5aa7.js",
					revision: "59baa0ce862c5aa7",
				},
				{
					url: "/_next/static/chunks/485-3a0eddc5605bbf27.js",
					revision: "3a0eddc5605bbf27",
				},
				{
					url: "/_next/static/chunks/573-07f64c0a15e1c3fc.js",
					revision: "07f64c0a15e1c3fc",
				},
				{
					url: "/_next/static/chunks/602-86cf456171c78c6a.js",
					revision: "86cf456171c78c6a",
				},
				{
					url: "/_next/static/chunks/634-c564ce362f9177f3.js",
					revision: "c564ce362f9177f3",
				},
				{
					url: "/_next/static/chunks/846-3ada21b87e61c34e.js",
					revision: "3ada21b87e61c34e",
				},
				{
					url: "/_next/static/chunks/8d3cd2ef-5cc9ce354a0486cc.js",
					revision: "5cc9ce354a0486cc",
				},
				{
					url: "/_next/static/chunks/955-0fd1844793966e92.js",
					revision: "0fd1844793966e92",
				},
				{
					url: "/_next/static/chunks/987-9ca390711d23662d.js",
					revision: "9ca390711d23662d",
				},
				{
					url: "/_next/static/chunks/app/_not-found/page-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/api/airbear/location/route-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/api/auth/callback/route-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/api/health/route-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/api/stripe/checkout/route-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/api/stripe/webhook/route-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/auth/login/page-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/auth/page-13094d4335f2d6a8.js",
					revision: "13094d4335f2d6a8",
				},
				{
					url: "/_next/static/chunks/app/auth/signup/page-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/challenges/page-74d77c7ecc9df2bf.js",
					revision: "74d77c7ecc9df2bf",
				},
				{
					url: "/_next/static/chunks/app/dashboard/page-02539cdc2b8e0ff5.js",
					revision: "02539cdc2b8e0ff5",
				},
				{
					url: "/_next/static/chunks/app/driver/page-2fdd48dc1090f01c.js",
					revision: "2fdd48dc1090f01c",
				},
				{
					url: "/_next/static/chunks/app/help/page-14f56a5613a53f70.js",
					revision: "14f56a5613a53f70",
				},
				{
					url: "/_next/static/chunks/app/layout-57f36a2aa48a10a6.js",
					revision: "57f36a2aa48a10a6",
				},
				{
					url: "/_next/static/chunks/app/map/page-5833289b4ded01af.js",
					revision: "5833289b4ded01af",
				},
				{
					url: "/_next/static/chunks/app/not-found-8efbc43955b1d133.js",
					revision: "8efbc43955b1d133",
				},
				{
					url: "/_next/static/chunks/app/page-914fac25836e76ba.js",
					revision: "914fac25836e76ba",
				},
				{
					url: "/_next/static/chunks/app/privacy/page-cb742742bdc9395b.js",
					revision: "cb742742bdc9395b",
				},
				{
					url: "/_next/static/chunks/app/products/page-2f5f28625e775102.js",
					revision: "2f5f28625e775102",
				},
				{
					url: "/_next/static/chunks/app/rewards/page-774c6c4e1066ada0.js",
					revision: "774c6c4e1066ada0",
				},
				{
					url: "/_next/static/chunks/app/safety/page-1b368d360a58e209.js",
					revision: "1b368d360a58e209",
				},
				{
					url: "/_next/static/chunks/app/support/page-4ee5a051359eac27.js",
					revision: "4ee5a051359eac27",
				},
				{
					url: "/_next/static/chunks/app/terms/page-40a86ee146a070e2.js",
					revision: "40a86ee146a070e2",
				},
				{
					url: "/_next/static/chunks/ed48eaa7.8f6e4e89d60bd6a1.js",
					revision: "8f6e4e89d60bd6a1",
				},
				{
					url: "/_next/static/chunks/framework-097a0c3b11b3ed30.js",
					revision: "097a0c3b11b3ed30",
				},
				{
					url: "/_next/static/chunks/main-app-df51fc1bb45e78e0.js",
					revision: "df51fc1bb45e78e0",
				},
				{
					url: "/_next/static/chunks/main-d84bb1e0b55e4721.js",
					revision: "d84bb1e0b55e4721",
				},
				{
					url: "/_next/static/chunks/pages/_app-2d4dd5078c0d7db8.js",
					revision: "2d4dd5078c0d7db8",
				},
				{
					url: "/_next/static/chunks/pages/_error-3662f15f334b96eb.js",
					revision: "3662f15f334b96eb",
				},
				{
					url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
					revision: "846118c33b2c0e922d7b3a7676f81f6f",
				},
				{
					url: "/_next/static/chunks/webpack-54bcd9c77a047a07.js",
					revision: "54bcd9c77a047a07",
				},
				{
					url: "/_next/static/css/55693049b062c6a3.css",
					revision: "55693049b062c6a3",
				},
				{
					url: "/_next/static/css/850001201f8a2867.css",
					revision: "850001201f8a2867",
				},
				{
					url: "/_next/static/css/cb25679c2a9ac375.css",
					revision: "cb25679c2a9ac375",
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
					url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
					revision: "01ba6c2a184b8cba08b0d57167664d75",
				},
				{
					url: "/_next/static/media/9a4ee768fed045da-s.p.woff2",
					revision: "51eee31e9cbbffe82e6d01f1c5f876a1",
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
					url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
					revision: "65850a373e258f1c897a2b3d75eb74de",
				},
				{
					url: "/_next/static/media/layers-2x.9859cd12.png",
					revision: "9859cd12",
				},
				{
					url: "/_next/static/media/layers.ef6db872.png",
					revision: "ef6db872",
				},
				{
					url: "/_next/static/media/marker-icon.d577052a.png",
					revision: "d577052a",
				},
				{
					url: "/airbear-mascot.png",
					revision: "26ff293dba97256f12327b0c219a86b0",
				},
				{
					url: "/apple-icon.png",
					revision: "734ce6c878789fcd5843e8a7963e0756",
				},
				{
					url: "/apple-icon.svg",
					revision: "37935901ddbb04c5ff7268fd3ca9a0d0",
				},
				{ url: "/favicon.ico", revision: "abd5ebe9e287ca0a89f4fd3da2b5cf9c" },
				{
					url: "/google-icon.svg",
					revision: "28bf1aa530d151c4046cae6b3ed23af3",
				},
				{
					url: "/icon-192x192.png",
					revision: "734ce6c878789fcd5843e8a7963e0756",
				},
				{
					url: "/icon-512x512.png",
					revision: "734ce6c878789fcd5843e8a7963e0756",
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
				{ url: "/manifest.json", revision: "dcbb5a6b92b718e0bbc3a130cc1ba3fa" },
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
							response: a,
							event: c,
							state: s,
						}) =>
							a && "opaqueredirect" === a.type
								? new Response(a.body, {
										status: 200,
										statusText: "OK",
										headers: a.headers,
									})
								: a,
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
